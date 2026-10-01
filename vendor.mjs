import fs from 'fs';
import path from 'path';
import { rollup } from '@rollup/wasm-node';

const vendorDir = path.resolve(process.cwd(), 'dist/vendor');
if (!fs.existsSync(vendorDir)) {
  fs.mkdirSync(vendorDir, { recursive: true });
}

console.log('[1/4] Bundling local lucide-react...');
const lucideBundle = await rollup({
  input: 'node_modules/lucide-react/dist/esm/lucide-react.mjs',
  external: ['react']
});
const { output: lucideOutput } = await lucideBundle.generate({ format: 'esm' });
fs.writeFileSync(path.join(vendorDir, 'lucide-react.js'), lucideOutput[0].code);
console.log('lucide-react.js written:', (lucideOutput[0].code.length / 1024).toFixed(1), 'KB');

console.log('[2/4] Bundling local sucrase...');
const sucraseResolver = {
  name: 'sucrase-res',
  resolveId(source, importer) {
    if (source.startsWith('.')) {
      const dir = importer ? path.dirname(importer) : process.cwd();
      const res = path.resolve(dir, source);
      for (const f of [res, res + '.js', res + '/index.js']) {
        if (fs.existsSync(f) && !fs.statSync(f).isDirectory()) return f;
      }
    }
    return null;
  }
};
const sucraseBundle = await rollup({
  input: 'node_modules/sucrase/dist/esm/index.js',
  plugins: [sucraseResolver],
  external: ['lines-and-columns', 'ts-interface-checker', '@jridgewell/gen-mapping']
});
const { output: sucraseOutput } = await sucraseBundle.generate({ format: 'esm' });
fs.writeFileSync(path.join(vendorDir, 'sucrase.js'), sucraseOutput[0].code);
console.log('sucrase.js written:', (sucraseOutput[0].code.length / 1024).toFixed(1), 'KB');

console.log('[3/4] Downloading standalone react & react-dom from esm.sh...');
const reactCode = await fetch('https://esm.sh/react@19.0.0?bundle').then(r => r.text());
fs.writeFileSync(path.join(vendorDir, 'react.js'), reactCode);

const reactDomCode = await fetch('https://esm.sh/react-dom@19.0.0/client?bundle').then(r => r.text());
fs.writeFileSync(path.join(vendorDir, 'react-dom-client.js'), reactDomCode);

console.log('react.js and react-dom-client.js written!');
console.log('[4/4] All vendor libraries bundled locally!');
