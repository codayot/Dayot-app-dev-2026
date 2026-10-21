// Starts both servers with one command (works on Windows, Mac and Linux): npm start
const { spawn } = require('child_process');
const path = require('path');

const servers = [
  ['auth-server', path.join(__dirname, 'auth-server', 'server.js')],
  ['blog-api', path.join(__dirname, 'blog-api', 'server.js')],
];

for (const [name, file] of servers) {
  const child = spawn(process.execPath, [file], { stdio: 'inherit' });
  child.on('exit', (code) => {
    console.log(`${name} stopped (code ${code})`);
    process.exit(code || 0);
  });
}
