/// <reference types="./utils.d.mts" />
import * as $list from "../gleam_stdlib/gleam/list.mjs";
import { Continue, Stop } from "../gleam_stdlib/gleam/list.mjs";
import { Ok, Error } from "./gleam.mjs";

export function fold_with_rest(loop$ls, loop$acc, loop$f) {
  while (true) {
    let ls = loop$ls;
    let acc = loop$acc;
    let f = loop$f;
    if (ls.hasLength(0)) {
      return acc;
    } else {
      let first = ls.head;
      let rest = ls.tail;
      let _pipe = rest;
      loop$ls = _pipe;
      loop$acc = f(acc, first, rest);
      loop$f = f;
    }
  }
}

export function fold_until_with_rest(loop$ls, loop$acc, loop$i, loop$f) {
  while (true) {
    let ls = loop$ls;
    let acc = loop$acc;
    let i = loop$i;
    let f = loop$f;
    if (ls.hasLength(0)) {
      return [acc, i];
    } else {
      let first = ls.head;
      let rest = ls.tail;
      let $ = f(acc, first, rest);
      if ($ instanceof Continue) {
        let next = $[0];
        let _pipe = rest;
        loop$ls = _pipe;
        loop$acc = next;
        loop$i = i + 1;
        loop$f = f;
      } else {
        let done = $[0];
        return [done, i];
      }
    }
  }
}

export function get_first_rest(ls) {
  if (ls.atLeastLength(1)) {
    let first = ls.head;
    let rest = ls.tail;
    let _pipe = [first, rest];
    return new Ok(_pipe);
  } else {
    return new Error(undefined);
  }
}

export function result_guard(r, default$, callback) {
  if (r.isOk()) {
    let x = r[0];
    return callback(x);
  } else {
    return default$;
  }
}
