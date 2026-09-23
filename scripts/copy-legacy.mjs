// Postbuild step: copies the mirrored legacy site (legacy-site/) into dist/
// so it's served at the site root, alongside the app build at dist/new/.
import { cp } from 'node:fs/promises'
import path from 'node:path'

const root = path.resolve(import.meta.dirname, '..')

await cp(path.join(root, 'legacy-site'), path.join(root, 'dist'), { recursive: true })
console.log('Copied legacy-site/ into dist/')
