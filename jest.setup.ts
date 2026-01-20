import fetch, { Headers, Request, Response } from 'cross-fetch';
import { TextDecoder, TextEncoder } from 'util';

if (typeof global.TextEncoder === 'undefined') {
  global.TextEncoder = TextEncoder;
}

if (typeof global.TextDecoder === 'undefined') {
    // TextDecoder type definitions differ between util and DOM, so cast to satisfy both.
    global.TextDecoder = TextDecoder as unknown as typeof global.TextDecoder;
}

if (typeof global.fetch === 'undefined') {
  global.fetch = fetch as unknown as typeof global.fetch;
  global.Headers = Headers as unknown as typeof global.Headers;
  global.Request = Request as unknown as typeof global.Request;
  global.Response = Response as unknown as typeof global.Response;
}
