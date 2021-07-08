import {
  createServer,
  IncomingMessage,
  ServerResponse,
  OutgoingHttpHeaders,
} from 'http';
import * as fs from 'fs';
import {
  host,
  port,
  path,
  enc,
  contentTypeMime,
  ok,
  notFound,
  serverError,
  methodNotAllowed,
  gone,
} from './constans';

createServer((request: IncomingMessage, response: ServerResponse) => {
  switch (request.method) {
    case 'GET': {
      fs.readFile(path, enc, (error, data) => {
        if (error) {
          response.writeHead(notFound, contentTypeMime);
          return response.end('Resourse not found!');
        }
        response.writeHead(ok, contentTypeMime);
        return response.end(data);
      });
      break;
    }
    case 'POST': {
      let body: string = '';
      request.on('data', (chunk) => {
        body += chunk;
      });
      request.on('end', () => {
        fs.writeFile(path, (body += '\n'), (err) => {
          if (err) {
            response.writeHead(serverError, contentTypeMime);
            return response.end('Server error!');
          }
          response.writeHead(ok, contentTypeMime);
          return response.end('File is written');
        });
      });
      break;
    }
    case 'DELETE': {
      fs.unlink(path, (error) => {
        if (error) {
          response.writeHead(gone, contentTypeMime);
          return response.end('Gone');
        }
        response.writeHead(ok, contentTypeMime);
        return response.end(`${path.substring(2)} was deleted`);
      });
      break;
    }
    case 'PATCH': {
      fs.access(path, fs.constants.R_OK, (err) => {
        if (err) {
          response.writeHead(notFound, contentTypeMime);
          return response.end('Resourse not found!');
        }
        let body: string = '';
        request.on('data', (chunk) => {
          body += chunk;
        });
        request.on('end', () => {
          fs.appendFile(path, (body += '\n'), (err) => {
            if (err) {
              response.writeHead(serverError, contentTypeMime);
              return response.end('Internal Server Error');
            }
            response.writeHead(ok, contentTypeMime);
            return response.end('File is written');
          });
        });
      });
      break;
    }

    default: {
      response.writeHead(methodNotAllowed, contentTypeMime);
      response.end('Method Not Allowed');
      break;
    }
  }
}).listen(port, host, () => {
  console.log(`Server listens http://${host}:${port}`);
});
