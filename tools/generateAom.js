import fs from 'fs-extra'
import path from 'path'
import { fileURLToPath } from 'url'
import crypto from 'crypto'
import { globSync } from 'glob'
import { parse } from '@babel/parser'


function deterministicId(filePath, line, name) {
  const h = crypto.createHash('sha256')
  h.update(filePath + '::' + (line||0) + '::' + (name||''))
  return h.digest('hex').slice(0, 12)
}

function isInteractiveJSX(node) {
  if (!node || node.type !== 'JSXElement') return false
  const name = node.openingElement.name
  if (!name) return false
  const tag = name.type === 'JSXIdentifier' ? name.name : null
  if (!tag) return false
  const interactiveTags = ['button','input','textarea','select','a']
  if (interactiveTags.includes(tag)) return true
  // check attributes for onClick/onChange/onSubmit/onKeyDown
  const attrs = node.openingElement.attributes || []
  for (const a of attrs) {
    if (a.type === 'JSXAttribute' && a.name && a.name.name) {
      const n = a.name.name
      if (['onClick','onChange','onSubmit','onKeyDown','onBlur','onFocus'].includes(n)) return true
    }
  }
  return false
}

export async function generateAomFromDir(srcDir, outDir) {
  await fs.ensureDir(outDir)
  const files = globSync('**/*.{js,jsx,ts,tsx}', { cwd: srcDir, nodir: true })
  const manifest = { version: '1.0', actions: [] }
  for (const rel of files) {
    const abs = path.join(srcDir, rel)
    let code = ''
    try { code = await fs.readFile(abs, 'utf8') } catch(e) { continue }
    let ast
    try {
      ast = parse(code, { sourceType: 'module', plugins: ['jsx','typescript'] })
    } catch (e) { continue }
    function walk(node, cb) {
      if (!node || typeof node !== 'object') return
      if (node.type === 'JSXElement') cb(node)
      for (const key of Object.keys(node)) {
        const child = node[key]
        if (Array.isArray(child)) {
          for (const c of child) walk(c, cb)
        } else if (child && typeof child === 'object') {
          walk(child, cb)
        }
      }
    }

    walk(ast, (jsxNode) => {
      if (isInteractiveJSX(jsxNode)) {
        const loc = jsxNode.loc && jsxNode.loc.start && jsxNode.loc.start.line
        const nameNode = jsxNode.openingElement.name
        const tag = nameNode && nameNode.type === 'JSXIdentifier' ? nameNode.name : 'custom'
        let label = ''
        const attrs = jsxNode.openingElement.attributes || []
        let handler = 'inline_handler'
        for (const a of attrs) {
          if (a.type === 'JSXAttribute' && a.name && a.name.name) {
            const n = a.name.name
            if (n === 'aria-label' || n === 'placeholder' || n === 'title') {
              if (a.value && a.value.type === 'StringLiteral') label = a.value.value
            }
            if (['onClick','onChange','onSubmit','onKeyDown'].includes(n)) handler = n
          }
        }
        const actionId = `${rel.replace(/\\/g,'/')}:${deterministicId(rel, loc, tag)}`
        manifest.actions.push({ action_id: actionId, file: rel, component: '', tag, handler, description: label || `Interactive ${tag}`, metadata: { line: loc } })
      }
    })
  }
  // write per-file JS wrappers
  for (const action of manifest.actions) {
    const fileOut = path.join(outDir, action.file + '.aom.js')
    await fs.ensureDir(path.dirname(fileOut))
    const wrapper = `// Generated AOM wrapper for ${action.file}\nexport const ${action.action_id.replace(/[^a-zA-Z0-9_]/g,'_')} = ${JSON.stringify(action, null, 2)}\n`
    await fs.writeFile(fileOut, wrapper, 'utf8')
  }
  // write manifest
  await fs.writeFile(path.join(outDir,'manifest.json'), JSON.stringify(manifest, null, 2), 'utf8')
  return manifest
}

export default generateAomFromDir
