#!/usr/bin/env node
import fs from 'fs-extra'
import path from 'path'
import os from 'os'
import { fileURLToPath } from 'url'
import unzipper from 'unzipper'
import archiver from 'archiver'
import generateAom from './generateAom.js'

async function run() {
  const argv = process.argv.slice(2)
  if (argv.length < 2) {
    console.error('Usage: cli-generate-aom <input-zip> <output-zip>')
    process.exit(2)
  }
  const [inputZip, outputZip] = argv
  const tmp = await fs.mkdtemp(path.join(os.tmpdir(),'aom-'))
  const extractDir = path.join(tmp,'src')
  await fs.ensureDir(extractDir)
  // extract
  await new Promise((res, rej) => {
    fs.createReadStream(inputZip)
      .pipe(unzipper.Extract({ path: extractDir }))
      .on('close', res)
      .on('error', rej)
  })
  const outDir = path.join(tmp,'AI')
  await generateAom(extractDir, outDir)
  // zip AI folder
  await new Promise((res, rej) => {
    const output = fs.createWriteStream(outputZip)
    const archive = archiver('zip', { zlib: { level: 9 } })
    output.on('close', res)
    archive.on('error', rej)
    archive.pipe(output)
    archive.directory(outDir, false)
    archive.finalize()
  })
  console.log('Generated', outputZip)
}

run().catch(e => { console.error(e); process.exit(1) })
