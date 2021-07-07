import { createServer, IncomingMessage, ServerResponse } from 'http';
import * as fs from 'fs';

const host: string = '127.0.0.1';
const port: number = 3000;
const path: string = './newFile.txt';

createServer((request: IncomingMessage, response: ServerResponse) => {
    switch (request.method) {
        case 'GET': {
            fs.readFile(path, 'utf-8', (error, data) => {
                if (error) {
                    response.writeHead(404, { 'Content-Type': 'text/plain' })
                    response.end('Resourse not found!');
                }
                else {
                    response.writeHead(200, { 'Content-Type': 'text/plain' })
                    response.end(data);
                }
            })
            break;
        }
        case 'POST': {
            let body: string = '';
            request.on('data', chunk => {
                body += chunk;
            })
            request.on('end', () => {
                fs.writeFile(path, body += '\n', err => {
                    if (err) {
                        response.writeHead(500, { 'Content-Type': 'text/plain' })
                        response.end('Server error!');
                    } else {
                        response.writeHead(200, { 'Content-Type': 'text/plain' })
                        response.end('File is written');
                    }
                })
            })
            break;
        }
        case 'DELETE': {
            fs.unlink(path, error => {
                if (error) {
                    response.writeHead(410, { 'Content-Type': 'text/plain' })
                    response.end('Gone');
                } else {
                    response.writeHead(200, { 'Content-Type': 'text/plain' })
                    response.end(`${path.substring(2)} was deleted`)
                }
            });
            break;
        }
        case 'PATCH': {
            fs.access(path, fs.constants.R_OK, err => {
                if (err) {
                    response.writeHead(404, { 'Content-Type': 'text/plain' })
                    response.end("Resourse not found!");

                } else {
                    let body: string = '';
                    request.on('data', chunk => {
                        body += chunk;
                    })
                    request.on('end', () => {
                        fs.appendFile(path, body += '\n', err => {
                            if (err) {
                                response.writeHead(500, { 'Content-Type': 'text/plain' })
                                response.end('Internal Server Error');
                            } else {
                                response.writeHead(200, { 'Content-Type': 'text/plain' })
                                response.end('File is written');
                            }
                        }
                        )
                    })
                }
            })
            break;
        }

        default: {
            response.writeHead(405, { 'Content-Type': 'text/plain' })
            response.end('Method Not Allowed');
            break
        }
    }
}).listen(port, host, () => {
    console.log(`Server listens http://${host}:${port}`)
})
