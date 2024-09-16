/// <reference types="./guard.d.mts" />
import * as $list from "../../../gleam_stdlib/gleam/list.mjs";
import { contains, reverse } from "../../../gleam_stdlib/gleam/list.mjs";
import * as $option from "../../../gleam_stdlib/gleam/option.mjs";
import { None, Some } from "../../../gleam_stdlib/gleam/option.mjs";
import * as $types from "../../lexer/internals/types.mjs";
import { Lexer } from "../../lexer/internals/types.mjs";
import * as $update from "../../lexer/internals/update.mjs";
import * as $tok from "../../tok.mjs";

export function whitespace(l, c, token_func, callback) {
  if (c === " ") {
    let _pipe = l;
    return $update.tokenise_acc(_pipe, token_func);
  } else if (c === "\t") {
    let _pipe = l;
    return $update.tokenise_acc(_pipe, token_func);
  } else if (c === "\n") {
    let _pipe = l;
    let _pipe$1 = $update.tokenise_acc(_pipe, token_func);
    return $update.increment_ln(_pipe$1);
  } else {
    return callback();
  }
}

export function whitespace_identifier(l, c, callback) {
  if (c === " ") {
    let _pipe = l;
    return $update.tokenise_acc_identifier(_pipe);
  } else if (c === "\t") {
    let _pipe = l;
    return $update.tokenise_acc_identifier(_pipe);
  } else if (c === "\n") {
    let _pipe = l;
    let _pipe$1 = $update.tokenise_acc_identifier(_pipe);
    return $update.increment_ln(_pipe$1);
  } else {
    return callback();
  }
}

function invalid(l, c, char_list, is_whitelist, callback) {
  let $ = (() => {
    let _pipe = char_list;
    return contains(_pipe, c);
  })();
  if ($ && is_whitelist) {
    return callback();
  } else if (!$ && !is_whitelist) {
    return callback();
  } else if (!$ && is_whitelist) {
    let $1 = l.acc;
    if ($1 instanceof Some) {
      let acc = $1[0][0];
      let t = (() => {
        let _pipe = acc;
        let _pipe$1 = reverse(_pipe);
        let _pipe$2 = new Some(_pipe$1);
        return new $tok.Invalid(_pipe$2, c);
      })();
      let _pipe = l.withFields({ acc: new None() });
      return $update.add_token(_pipe, t);
    } else {
      let t = new $tok.Invalid(new None(), c);
      let _pipe = l.withFields({ acc: new None() });
      return $update.add_token(_pipe, t);
    }
  } else {
    let $1 = l.acc;
    if ($1 instanceof Some) {
      let acc = $1[0][0];
      let t = (() => {
        let _pipe = acc;
        let _pipe$1 = reverse(_pipe);
        let _pipe$2 = new Some(_pipe$1);
        return new $tok.Invalid(_pipe$2, c);
      })();
      let _pipe = l.withFields({ acc: new None() });
      return $update.add_token(_pipe, t);
    } else {
      let t = new $tok.Invalid(new None(), c);
      let _pipe = l.withFields({ acc: new None() });
      return $update.add_token(_pipe, t);
    }
  }
}

export function blacklist(l, c, blacklist, callback) {
  let _pipe = l;
  return invalid(_pipe, c, blacklist, false, callback);
}

export function whitelist(l, c, blacklist, callback) {
  let _pipe = l;
  return invalid(_pipe, c, blacklist, true, callback);
}
