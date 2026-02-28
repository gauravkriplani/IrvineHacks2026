import express from 'express'
import cors from 'cors'
import multer from 'multer'
import fs from 'fs-extra'
import path from 'path'
import os from 'os'
import unzipper from 'unzipper'
import archiver from 'archiver'
import generateAom from '../tools/generateAom.js'

const app = express()
app.use(cors())
const upload = multer({ dest: os.tmpdir(), limits: { fileSize: 100 * 1024 * 1024 } })

app.post('/api/generate-aom', upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).send('no file')
  try {
    const tmp = await fs.mkdtemp(path.join(os.tmpdir(),'aom-'))
    const extractDir = path.join(tmp,'src')
    await fs.ensureDir(extractDir)
    // extract
    await new Promise((resv, rej) => {
      fs.createReadStream(req.file.path)
        .pipe(unzipper.Extract({ path: extractDir }))
        .on('close', resv)
        .on('error', rej)
    })
    const outDir = path.join(tmp,'AI')
    await generateAom(extractDir, outDir)
    // zip and stream
    res.setHeader('Content-Type','application/zip')
    res.setHeader('Content-Disposition','attachment; filename="aom-wrappers.zip"')
    const archive = archiver('zip', { zlib: { level: 9 } })
    archive.on('error', (err) => { console.error('Archive error:', err); })
    archive.pipe(res)
    archive.directory(outDir, false)
    await archive.finalize()
    // cleanup
    await fs.remove(tmp).catch(() => {})
    await fs.remove(req.file.path).catch(() => {})
  } catch (err) {
    console.error('AOM generation error:', err)
    if (!res.headersSent) res.status(500).send('Internal error: ' + err.message)
  }
})

const port = process.env.PORT || 4000
app.listen(port, () => console.log('AOM server running on port', port))
