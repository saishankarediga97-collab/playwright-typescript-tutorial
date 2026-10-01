import http from 'http';

const endpoints = [
  '/',
  '/@vite/client',
  '/src/main.tsx',
  '/src/index.css',
  '/src/App.tsx'
];

async function check(url) {
  return new Promise((resolve) => {
    http.get('http://127.0.0.1:5173' + url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({ url, status: res.statusCode, length: data.length, error: res.statusCode >= 400 ? data : null });
      });
    }).on('error', (err) => {
      resolve({ url, status: 'ERROR', message: err.message });
    });
  });
}

async function run() {
  for (const ep of endpoints) {
    const res = await check(ep);
    console.log(`Endpoint: ${res.url} -> Status: ${res.status} (${res.length || 0} bytes)`);
    if (res.error) console.log('Error content:', res.error.slice(0, 300));
    if (res.message) console.log('Network error:', res.message);
  }
}

run();
