const net = require('net');

const port = parseInt(process.env.PORT || '5000', 10);

function checkPort(p) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.once('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        resolve({ free: false, port: p });
      } else {
        resolve({ free: false, port: p, error: err.message });
      }
    });
    server.once('listening', () => {
      server.close();
      resolve({ free: true, port: p });
    });
    server.listen(p, '0.0.0.0');
  });
}

(async () => {
  const result = await checkPort(port);
  if (result.free) {
    console.log(`port ${port} appears free`);
    process.exit(0);
  }

  console.error(`port ${port} is in use. To debug:\n- Run: netstat -ano | Select-String ":${port}"\n- Kill PID (if you understand it): taskkill /PID <PID> /F\nOr run the dev server on another port: $env:PORT='5001'; npm run dev\n`);
  process.exit(2);
})();
