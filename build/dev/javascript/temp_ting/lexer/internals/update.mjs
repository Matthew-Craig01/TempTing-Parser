/// <reference types="./update.d.mts" />
import * as $io from "../../../gleam_stdlib/gleam/io.mjs";
import { debug } from "../../../gleam_stdlib/gleam/io.mjs";
import * as $list from "../../../gleam_stdlib/gleam/list.mjs";
import { Continue, Stop, contains, fold_until, reverse } from "../../../gleam_stdlib/gleam/list.mjs";
import * as $option from "../../../gleam_stdlib/gleam/option.mjs";
import { None, Some } from "../../../gleam_stdlib/gleam/option.mjs";
import * as $string from "../../../gleam_stdlib/gleam/string.mjs";
import { to_graphemes } from "../../../gleam_stdlib/gleam/string.mjs";
import { Ok, Error, toList, prepend as listPrepend } from "../../gleam.mjs";
import * as $types from "../../lexer/internals/types.mjs";
import { Lexer } from "../../lexer/internals/types.mjs";
import * as $tok from "../../tok.mjs";

export function increment(l) {
  return l.withFields({
    pos: new $tok.Pos(l.pos.ln, l.pos.col + 1, l.pos.char + 1)
  });
}

export function increment_ln(l) {
  return l.withFields({ pos: new $tok.Pos(l.pos.ln + 1, -1, l.pos.char) });
}

export function add_token_with_pos(l, t, pos) {
  let new_tokens = listPrepend([t, pos], l.tokens);
  return l.withFields({ tokens: new_tokens });
}

export function add_token(l, t) {
  return add_token_with_pos(l, t, l.pos);
}

export function change_context(l, context) {
  return l.withFields({ context: context });
}

export function add_to_acc(l, c) {
  let acc = (() => {
    let _pipe = (() => {
      let $ = l.acc;
      if ($ instanceof None) {
        return [toList([c]), l.pos];
      } else {
        let chars = $[0][0];
        let pos = $[0][1];
        return [listPrepend(c, chars), pos];
      }
    })();
    return new Some(_pipe);
  })();
  return l.withFields({ acc: acc });
}

function check_identifier(chars) {
  let _pipe = chars;
  return fold_until(
    _pipe,
    new Ok(undefined),
    (_, char) => {
      let $ = (() => {
        let _pipe$1 = toList(["_", ",", "<", ":", "\""]);
        return contains(_pipe$1, char);
      })();
      if ($) {
        return new Stop(new Error(char));
      } else {
        return new Continue(new Ok(undefined));
      }
    },
  );
}

function tokenise_acc_(l, acc, pos, token_func) {
  let t = (() => {
    let _pipe = acc;
    let _pipe$1 = reverse(_pipe);
    return token_func(_pipe$1);
  })();
  let _pipe = l.withFields({ acc: new None() });
  return add_token_with_pos(_pipe, t, pos);
}

export function tokenise_acc(l, token_func) {
  let $ = l.acc;
  if ($ instanceof Some) {
    let acc = $[0][0];
    let pos = $[0][1];
    let _pipe = l;
    return tokenise_acc_(_pipe, acc, pos, token_func);
  } else {
    return l;
  }
}

export function tokenise_acc_identifier(l) {
  let $ = l.acc;
  if ($ instanceof None) {
    return l;
  } else {
    let chars = $[0][0];
    let pos = $[0][1];
    let $1 = check_identifier(chars);
    if ($1.isOk() && !$1[0]) {
      let _pipe = l;
      return tokenise_acc_(
        _pipe,
        chars,
        pos,
        (var0) => { return new $tok.Identifier(var0); },
      );
    } else {
      let char = $1[0];
      let _pipe = l;
      return tokenise_acc_(
        _pipe,
        chars,
        pos,
        (chars) => { return new $tok.Invalid(new Some(chars), char); },
      );
    }
  }
}
