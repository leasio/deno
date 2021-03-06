// Copyright 2018 the Deno authors. All rights reserved. MIT license.

import { Console } from "./console";
import { RawSourceMap } from "./types";

declare global {
  interface Window {
    console: Console;
  }

  const console: Console;
  const window: Window;
}

// If you use the eval function indirectly, by invoking it via a reference
// other than eval, as of ECMAScript 5 it works in the global scope rather than
// the local scope. This means, for instance, that function declarations create
// global functions, and that the code being evaluated doesn't have access to
// local variables within the scope where it's being called.
export const globalEval = eval;

// A reference to the global object.
export const window = globalEval("this");
window.window = window;

// The libdeno functions are moved so that users can't access them.
type MessageCallback = (msg: Uint8Array) => void;
interface Libdeno {
  recv(cb: MessageCallback): void;
  send(msg: ArrayBufferView): null | Uint8Array;
  print(x: string): void;
  mainSource: string;
  mainSourceMap: RawSourceMap;
}
export const libdeno = window.libdeno as Libdeno;
window.libdeno = null;

// import "./url";

// import * as timer from "./timers";
// window["setTimeout"] = timer.setTimeout;
// window["setInterval"] = timer.setInterval;
// window["clearTimeout"] = timer.clearTimer;
// window["clearInterval"] = timer.clearTimer;

window.console = new Console(libdeno.print);

// import { fetch } from "./fetch";
// window["fetch"] = fetch;

// import { TextEncoder, TextDecoder } from "text-encoding";
// window["TextEncoder"] = TextEncoder;
// window["TextDecoder"] = TextDecoder;
