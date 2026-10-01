import { rollup } from '@rollup/wasm-node';
import { transform } from 'sucrase';
import path from 'path';
import fs from 'fs';

console.log('Testing custom rollup wasm + sucrase bundle...');

const sucrasePlugin = {
  name: 'sucrase',
  resolveId(source, importer) {
    if (source.startsWith('.')) {
      const dir = importer ? path.dirname(importer) : process.cwd();
      const resolved = path.resolve(dir, source);
      for (const ext of ['', '.tsx', '.ts', '.jsx', '.js']) {
        if (fs.existsSync(resolved + ext) && !fs.statSync(resolved + ext).isDirectory()) {
          return resolved + ext;
        }
      }
    }
    return null; // let node_modules resolve
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

async function test() {
  try {
    const bundle = await rollup({
      input: 'src/main.tsx',
      plugins: [sucrasePlugin],
      external: (id) => !id.startsWith('.') && !path.isAbsolute(id)
    });
    const { output } = await bundle.generate({ format: 'esm' });
    console.log('BUNDLE SUCCESS! Chunks:', output.length, 'Size:', output[0].code.length);
  } catch (err) {
    console.error('BUNDLE ERROR:', err);
  }
}

test();
