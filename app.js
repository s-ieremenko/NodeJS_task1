"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("http");
const fs = __importStar(require("fs"));
const host = '127.0.0.1';
const port = 3000;
const path = './ newFile.txt';
http_1.createServer((request, response) => {
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
            });
            break;
        }
        case 'POST': {
            let body = '';
            request.on('data', chunk => {
                body += chunk;
            });
            request.on('end', () => {
                fs.writeFile(path, body += '\n', err => {
                    if (err) {
                        response.statusCode = 404;
                        response.end('Resourse not found!');
                    }
                    else {
                        response.statusCode = 200;
                        response.setHeader('Content-Type', 'text/plain');
                        response.end('File is written');
                    }
                });
            });
            break;
        }
        case 'DELETE': {
            fs.unlink(path, error => {
                if (error) {
                    response.statusCode = 404;
                    response.end('Resourse not found!');
                }
                else {
                    response.end(`${path.substring(2)} was deleted`);
                }
            });
            break;
        }
        case 'PATCH': {
            fs.access(path, fs.constants.R_OK, err => {
                try {
                    if (err) {
                        throw err;
                    }
                    else {
                        let body = '';
                        request.on('data', chunk => {
                            body += chunk;
                        });
                        request.on('end', () => {
                            fs.appendFile(path, body += '\n', err => {
                                if (err) {
                                    response.statusCode = 500;
                                    response.end('Internal Server Error');
                                }
                                else {
                                    response.statusCode = 200;
                                    response.setHeader('Content-Type', 'text/plain');
                                    response.end('File is written');
                                }
                            });
                        });
                    }
                }
                catch (e) {
                    response.statusCode = 404;
                    response.end("Resourse not found!");
                }
            });
            break;
        }
        default: {
            response.statusCode = 405;
            response.setHeader('Content-Type', 'text/plain');
            response.end('Method Not Allowed');
            break;
        }
    }
}).listen(port, host, () => {
    console.log(`Server listens http://${host}:${port}`);
});
