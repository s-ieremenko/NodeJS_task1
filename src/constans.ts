import { OutgoingHttpHeaders } from "http";

export const host: string = "127.0.0.1";
export const port: number = 3000;
export const path: string = "./newFile.txt";
export const enc: string = "utf-8";
export const contentTypeMime: OutgoingHttpHeaders = {
  "Content-Type": "text/plain",
};
export const ok: number = 200;
export const notFound: number = 404;
export const serverError: number = 500;
export const gone: number = 410;
export const methodNotAllowed: number = 410;
