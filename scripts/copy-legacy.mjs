// Postbuild step: copies the mirrored legacy site (legacy-site/) into dist/old/,
// so it's served at /old alongside the app build at dist/new/ (which now also
// serves the site root, per the /new2 -> root move).
import { cp } from 'node:fs/promises'
import path from 'node:path'

const root = path.resolve(import.meta.dirname, '..')

await cp(path.join(root, 'legacy-site'), path.join(root, 'dist', 'old'), { recursive: true })
console.log('Copied legacy-site/ into dist/old/')
