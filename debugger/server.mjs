import polka from 'polka';
import serveStatic from 'serve-static';
import path from 'path';

const { PORT = 3001, PWD } = process.env;

polka()
  .use(serveStatic(path.resolve(PWD, 'debugger')))
  .get('/health', (req, res) => {
    res.end('OK');
  })
  .listen(PORT)
  .then(_ => {
    console.log(`> Running on localhost:${PORT}`);
  });
