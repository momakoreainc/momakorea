// One-off tool: mirrors the live momakorea.com homepage (HTML + relative-path
// assets) into legacy-site/, which is served as the site root. Not part of
// the regular build — rerun manually if the live site changes.
import { mkdir, writeFile, readFile } from 'node:fs/promises'
import path from 'node:path'

const ORIGIN = 'https://momakorea.com'
const OUT_DIR = path.resolve(import.meta.dirname, '..', 'legacy-site')

const htmlAssetPaths = [
  'favicon.png',
  'apple-touch-icon.png',
  'apple-touch-icon-72x72.png',
  'apple-touch-icon-114x114.png',
  'css/style.css',
  'images/brand.png',
  'images/brand-white.png',
  'images/intro.jpg',
  'images/about.jpg',
  'images/clients.jpg',
  'images/works/works_01.jpg',
  'images/works/works_02.jpg',
  'images/works/works_03.jpg',
  'images/works/works_04.jpg',
  'images/works/works_05.jpg',
  'images/works/works_06.jpg',
  'images/works/works_07.jpg',
  'images/works/works_08.jpg',
  'images/works/works_01_d01.jpg',
  'images/works/works_02_d01.jpg',
  'images/works/works_03_d01.jpg',
  'images/works/works_04_d01.jpg',
  'images/works/works_05_d01.jpg',
  'images/works/works_06_d01.jpg',
  'images/works/works_07_d01.jpg',
  'images/works/works_08_d01.jpg',
  'images/partners/_1.png',
  'images/partners/_2.png',
  'images/partners/_3.png',
  'images/partners/_4.png',
  'images/partners/_5.png',
  'images/partners/_6.png',
  'js/jquery.min.js',
  'js/bootstrap.min.js',
  'js/smoothscroll.js',
  'js/jquery.pagepiling.min.js',
  'js/jquery.magnific-popup.min.js',
  'js/owl.carousel.min.js',
  'js/scripts.js',
]

const downloaded = new Set()

async function downloadTo(relativePath) {
  if (downloaded.has(relativePath)) return true
  const url = `${ORIGIN}/${relativePath}`
  const dest = path.join(OUT_DIR, relativePath)
  const res = await fetch(url)
  if (!res.ok) {
    console.warn(`skip ${relativePath}: HTTP ${res.status}`)
    return false
  }
  await mkdir(path.dirname(dest), { recursive: true })
  const buf = Buffer.from(await res.arrayBuffer())
  await writeFile(dest, buf)
  downloaded.add(relativePath)
  console.log(`saved ${relativePath} (${buf.length} bytes)`)
  return true
}

function extractCssRefs(cssText) {
  const refs = new Set()
  const re = /url\(\s*['"]?([^'")]+)['"]?\s*\)/g
  let match
  while ((match = re.exec(cssText))) {
    const value = match[1]
    if (value.startsWith('data:') || value.startsWith('http') || value.startsWith('//')) continue
    refs.add(value.split('?')[0].split('#')[0])
  }
  return [...refs]
}

// Resolves a url() reference found inside cssRelPath. Root-absolute refs
// (leading '/') are relative to the site root; everything else is relative
// to the CSS file's own directory.
function resolveCssRef(cssRelPath, ref) {
  if (ref.startsWith('/')) return ref.slice(1)
  return path.posix.normalize(path.posix.join(path.posix.dirname(cssRelPath), ref))
}

async function processCss(cssRelPath) {
  const full = path.join(OUT_DIR, cssRelPath)
  const text = await readFile(full, 'utf-8')
  const refs = extractCssRefs(text)
  for (const ref of refs) {
    const resolved = resolveCssRef(cssRelPath, ref)
    const isCss = resolved.endsWith('.css')
    const ok = await downloadTo(resolved)
    if (ok && isCss) await processCss(resolved)
  }
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true })

  const homeRes = await fetch(`${ORIGIN}/`)
  const html = await homeRes.text()
  await writeFile(path.join(OUT_DIR, 'index.html'), html)
  console.log(`saved index.html (${html.length} bytes)`)

  for (const asset of htmlAssetPaths) {
    await downloadTo(asset)
  }

  await processCss('css/style.css')

  console.log('Done.')
}

main()
