import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const scriptDir = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.resolve(scriptDir, '..')
const nextDir = path.join(projectRoot, '.next')
const standaloneDir = path.join(nextDir, 'standalone')
const standaloneNextDir = path.join(standaloneDir, '.next')
const sourceStaticDir = path.join(nextDir, 'static')
const targetStaticDir = path.join(standaloneNextDir, 'static')
const sourcePublicDir = path.join(projectRoot, 'public')
const targetPublicDir = path.join(standaloneDir, 'public')

function ensureExists(targetPath, label) {
  if (!fs.existsSync(targetPath)) {
    throw new Error(`${label} not found: ${targetPath}`)
  }
}

function copyDirectory(sourceDir, targetDir) {
  fs.mkdirSync(targetDir, { recursive: true })
  fs.cpSync(sourceDir, targetDir, { recursive: true, force: true })
}

ensureExists(standaloneDir, 'Standalone output')
ensureExists(sourceStaticDir, 'Next static output')
ensureExists(sourcePublicDir, 'Public directory')

copyDirectory(sourceStaticDir, targetStaticDir)
copyDirectory(sourcePublicDir, targetPublicDir)

console.log('Standalone assets prepared successfully.')
