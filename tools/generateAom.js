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

// ── High-risk detection ────────────────────────────────────────────────────
// Keywords that indicate financial transactions, destructive actions, or
// anything an AI agent should pause and verify before executing.
const HIGH_RISK_TEXT_PATTERNS = [
  // financial / purchasing
  /\bpay(ment|ments|ing|now)?\b/i,
  /\bpurchas(e|ing)\b/i,
  /\bcheck\s*out\b/i,
  /\bbuy\b/i,
  /\bsubscrib(e|ing|tion)\b/i,
  /\border\s*(now|confirm)?\b/i,
  /\bplace\s*order\b/i,
  /\badd\s*to\s*cart\b/i,
  /\bcharg(e|ing)\b/i,
  /\bbilling\b/i,
  /\brefund\b/i,
  /\btransfer\b/i,
  /\bwithdraw\b/i,
  /\bdonat(e|ion)\b/i,
  /\btip\b/i,
  /\binvoice\b/i,
  /\bpric(e|ing)\b/i,
  /\bcredit\s*card\b/i,
  /\bcard\s*number\b/i,
  /\bcvv\b/i,
  // destructive / irreversible
  /\bdelete\b/i,
  /\bremove\b/i,
  /\bdestroy\b/i,
  /\bpermanent(ly)?\b/i,
  /\birreversible\b/i,
  /\bcancel\s*(plan|subscription|account)\b/i,
  /\bdeactivate\b/i,
  /\bclose\s*account\b/i,
  // sensitive data
  /\bpassword\b/i,
  /\bsocial\s*security\b/i,
  /\bssn\b/i,
  /\bbank\s*account\b/i,
]

const HIGH_RISK_HANDLERS = [
  'onCheckout', 'onPurchase', 'onBuy', 'onPay', 'onPayment',
  'onSubscribe', 'onOrder', 'onPlaceOrder', 'onConfirmOrder',
  'onDelete', 'onRemove', 'onDestroy', 'onDeactivate',
  'onTransfer', 'onWithdraw', 'onRefund', 'onDonate',
]

const HIGH_RISK_INPUT_TYPES = [
  'credit-card', 'payment', 'card-number', 'cvv', 'ssn',
]

/**
 * Returns true if any text content, attribute value, handler name, or input
 * type on the node matches a high-risk pattern.
 */
function isHighRisk(jsxNode) {
  const attrs = jsxNode.openingElement.attributes || []

  for (const a of attrs) {
    if (a.type !== 'JSXAttribute' || !a.name) continue
    const attrName = a.name.name || ''

    // Check handler names
    if (HIGH_RISK_HANDLERS.includes(attrName)) return true

    // Check string attribute values (aria-label, placeholder, title, name, id, type, value)
    if (a.value && a.value.type === 'StringLiteral') {
      const val = a.value.value
      if (attrName === 'type' && HIGH_RISK_INPUT_TYPES.includes(val.toLowerCase())) return true
      if (HIGH_RISK_TEXT_PATTERNS.some(rx => rx.test(val))) return true
    }

    // Check JSX expression attribute values (e.g. onClick={handlePurchase})
    if (a.value && a.value.type === 'JSXExpressionContainer') {
      const expr = a.value.expression
      if (expr && expr.type === 'Identifier') {
        if (HIGH_RISK_TEXT_PATTERNS.some(rx => rx.test(expr.name))) return true
        if (HIGH_RISK_HANDLERS.some(h => expr.name.toLowerCase().includes(h.toLowerCase().replace(/^on/,'')))) return true
      }
    }
  }

  // Check inline text children
  function getTextContent(node) {
    if (!node) return ''
    if (node.type === 'StringLiteral' || node.type === 'JSXText') return node.value || ''
    if (node.type === 'JSXElement') {
      return (node.children || []).map(getTextContent).join(' ')
    }
    if (node.type === 'JSXExpressionContainer' && node.expression) {
      if (node.expression.type === 'StringLiteral') return node.expression.value
    }
    return ''
  }
  const text = getTextContent(jsxNode)
  if (HIGH_RISK_TEXT_PATTERNS.some(rx => rx.test(text))) return true

  return false
}
// ──────────────────────────────────────────────────────────────────────────

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
        manifest.actions.push({
          action_id: actionId,
          file: rel,
          component: '',
          tag,
          handler,
          description: label || `Interactive ${tag}`,
          needs_review: isHighRisk(jsxNode),   // ← true if financial/high-risk signals detected
          metadata: { line: loc },
        })
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
