import { rollup } from '@rollup/wasm-node';
import { transform } from 'sucrase';
import path from 'path';
import fs from 'fs';
import postcss from 'postcss';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

const distDir = path.resolve(process.cwd(), 'dist');
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

console.log('[1/3] Compiling Tailwind CSS...');
const cssInput = fs.readFileSync('src/index.css', 'utf8');
const cssResult = await postcss([tailwindcss, autoprefixer]).process(cssInput, {
  from: 'src/index.css',
  to: 'dist/index.css'
});
fs.writeFileSync(path.join(distDir, 'index.css'), cssResult.css);
console.log(`[1/3] CSS compiled: ${(cssResult.css.length / 1024).toFixed(1)} KB`);

console.log('[2/3] Bundling TypeScript & React app with Rollup WASM + Sucrase...');
const sucrasePlugin = {
  name: 'sucrase-plugin',
  resolveId(source, importer) {
    if (source.startsWith('.')) {
      const dir = importer ? path.dirname(importer) : path.resolve(process.cwd(), 'src');
      const resolved = path.resolve(dir, source);
      for (const ext of ['', '.tsx', '.ts', '.jsx', '.js']) {
        if (fs.existsSync(resolved + ext) && !fs.statSync(resolved + ext).isDirectory()) {
          return resolved + ext;
        }
      }
    }
    return null; // External bare imports
  },
  transform(code, id) {
    if (id.endsWith('.css')) {
      return { code: 'export default "";', map: null };
    }
    if (id.endsWith('.ts') || id.endsWith('.tsx')) {
      const res = transform(code, {
        transforms: ['typescript', 'jsx'],
        jsxRuntime: 'classic',
        production: true
      });
      return { code: res.code, map: null };
    }
    return null;
  }
};

const bundle = await rollup({
  input: 'src/main.tsx',
  plugins: [sucrasePlugin],
  external: (id) => !id.startsWith('.') && !path.isAbsolute(id)
});

const { output } = await bundle.generate({
  format: 'esm'
});

const bundleJs = output[0].code;
fs.writeFileSync(path.join(distDir, 'bundle.js'), bundleJs);
console.log(`[2/3] Bundle generated: ${(bundleJs.length / 1024).toFixed(1)} KB`);

console.log('[3/3] Generating index.html with importmap...');
const htmlContent = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%233b82f6'><path d='M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5'/></svg>" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Master TypeScript & Playwright POM Framework | Interactive Masterclass</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="/index.css">
    <script type="importmap">
    {
      "imports": {
        "react": "/vendor/react.js",
        "react-dom": "/vendor/react.js",
        "react-dom/client": "/vendor/react-dom-client.js",
        "lucide-react": "/vendor/lucide-react.js",
        "sucrase": "/vendor/sucrase.js"
      }
    }
    </script>
  </head>
  <body class="bg-slate-950 text-slate-100 antialiased selection:bg-blue-500 selection:text-white">
    <div id="root"></div>
    <script type="module" src="/bundle.js"></script>
  </body>
</html>`;

fs.writeFileSync(path.join(distDir, 'index.html'), htmlContent);
console.log('[3/3] Build completed successfully into dist/!');
