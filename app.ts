import { createServer, IncomingMessage, ServerResponse } from 'http';
import * as fs from 'fs';

const host: string = '127.0.0.1';
const port: number = 3000;
const path: string = './ newFile.txt'

createServer((request: IncomingMessage, response: ServerResponse) => {
    switch (request.method) {
        case 'GET': {
            fs.readFile(path, 'utf-8', (error, data) => {
                if (error) {
                    response.statusCode = 404;
                    response.end('Resourse not found!');
                }
                else {
                    response.statusCode = 200;
                    response.setHeader('Content-Type', 'text/plain');
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
                        response.statusCode = 404;
                        response.end('Resourse not found!');
                    } else {
                        response.statusCode = 200;
                        response.setHeader('Content-Type', 'text/plain')
                        response.end('File is written');
                    }
                })
            })
            break;
        }
        case 'DELETE': {
            fs.unlink(path, error => {
                if (error) {
                    response.statusCode = 404;
                    response.end('Resourse not found!');
                } else {
                    response.end(`${path.substring(2)} was deleted`)
                }
            });
            break;
        }
        case 'PATCH': {
            fs.access(path, fs.constants.R_OK, err => {
                try {
                    if (err) {
                        throw err;
                    } else {
                        let body: string = '';
                        request.on('data', chunk => {
                            body += chunk;
                        })
                        request.on('end', () => {
                            fs.appendFile(path, body += '\n', err => {
                                if (err) {
                                    response.statusCode = 500;
                                    response.end('Internal Server Error');
                                } else {
                                    response.statusCode = 200;
                                    response.setHeader('Content-Type', 'text/plain')
                                    response.end('File is written');
                                }
                            }
                            )
                        })
                    }
                }
                catch (e) {
                    response.statusCode = 404;
                    response.end("Resourse not found!");
                }
            })
            break;
        }

        default: {
            response.statusCode = 405;
            response.setHeader('Content-Type', 'text/plain');
            response.end('Method Not Allowed');
            break
        }
    }
}).listen(port, host, () => {
    console.log(`Server listens http://${host}:${port}`)
})
