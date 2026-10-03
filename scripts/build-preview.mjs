// Construit une page unique (CSS et JS en ligne) pour l'aperçu publié en Artifact.
// Usage : npm run build:preview  →  preview/rugbyapp.html
import { execSync } from 'node:child_process'
import { readFileSync, writeFileSync, readdirSync, mkdirSync } from 'node:fs'

execSync('vite build --outDir dist-preview --emptyOutDir', { stdio: 'inherit', env: { ...process.env, VITE_PREVIEW: '1' } })
const assets = readdirSync('dist-preview/assets')
const js = assets.filter((f) => f.startsWith('index') && f.endsWith('.js'))
const css = assets.filter((f) => f.endsWith('.css'))
if (js.length !== 1) throw new Error(`Un seul bundle JS attendu, trouvé : ${js}`)
const read = (f) => readFileSync(`dist-preview/assets/${f}`, 'utf8')
const icon = readFileSync('public/favicon.svg', 'utf8')
const html = `<title>Rugbyapp</title>
<link rel="icon" href="data:image/svg+xml,${encodeURIComponent(icon)}">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Barlow:wght@400;500;600&family=Saira+Condensed:wght@700;800&display=swap">
<style>${css.map(read).join('\n')}</style>
<div id="root"></div>
<script type="module">${read(js[0]).replace(/<\/script/gi, '<\\/script')}</script>
`
mkdirSync('preview', { recursive: true })
writeFileSync('preview/rugbyapp.html', html)
console.log(`preview/rugbyapp.html : ${(html.length / 1024).toFixed(0)} Ko`)
