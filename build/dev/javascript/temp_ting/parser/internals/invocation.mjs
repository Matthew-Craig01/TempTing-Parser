/// <reference types="./invocation.d.mts" />
import * as $array from "../../../gleam_javascript/gleam/javascript/array.mjs";
import { from_list } from "../../../gleam_javascript/gleam/javascript/array.mjs";
import * as $bool from "../../../gleam_stdlib/gleam/bool.mjs";
import { guard, lazy_guard } from "../../../gleam_stdlib/gleam/bool.mjs";
import * as $io from "../../../gleam_stdlib/gleam/io.mjs";
import { debug } from "../../../gleam_stdlib/gleam/io.mjs";
import * as $list from "../../../gleam_stdlib/gleam/list.mjs";
import { is_empty, reverse, try_map } from "../../../gleam_stdlib/gleam/list.mjs";
import * as $option from "../../../gleam_stdlib/gleam/option.mjs";
import { None, Some } from "../../../gleam_stdlib/gleam/option.mjs";
import * as $result from "../../../gleam_stdlib/gleam/result.mjs";
import { map_error, try$ } from "../../../gleam_stdlib/gleam/result.mjs";
import * as $string from "../../../gleam_stdlib/gleam/string.mjs";
import { concat } from "../../../gleam_stdlib/gleam/string.mjs";
import { Ok, Error, toList, prepend as listPrepend, makeError } from "../../gleam.mjs";
import * as $err from "../../parser/err.mjs";
import * as $template from "../../parser/template.mjs";
import { Function, Interpolation, StringInvocation } from "../../parser/template.mjs";
import * as $tok from "../../tok.mjs";

function add_to_arg(acc, t, pos) {
  if (acc.hasLength(0)) {
    return toList([[toList([t]), pos, pos]]);
  } else {
    let first = acc.head[0];
    let from = acc.head[1];
    let rest = acc.tail;
    return listPrepend([listPrepend(t, first), from, pos], rest);
  }
}

function add_arg(acc, pos) {
  let ln = pos.ln;
  let col = pos.col;
  let char = pos.char;
  let from = new $tok.Pos(ln, col + 1, char + 1);
  let new$ = [toList([]), from, from];
  if (acc.hasLength(0)) {
    return toList([new$]);
  } else {
    let first = acc.head;
    let rest = acc.tail;
    return listPrepend(new$, listPrepend(first, rest));
  }
}

function get_args(toks, brackets, acc) {
  return lazy_guard(
    brackets < 0,
    () => {
      throw makeError(
        "panic",
        "parser/internals/invocation",
        92,
        "",
        "Brackets < 0",
        {}
      )
    },
    () => {
      if (toks.atLeastLength(1) && toks.head[0] instanceof $tok.OpenArgs) {
        let t = toks.head;
        let pos = toks.head[1];
        let rest = toks.tail;
        return get_args(
          rest,
          brackets + 1,
          (() => {
            let _pipe = acc;
            return add_to_arg(_pipe, t, pos);
          })(),
        );
      } else if (toks.hasLength(1) &&
      toks.head[0] instanceof $tok.CloseArgs &&
      brackets === 0) {
        let _pipe = acc;
        return new Ok(_pipe);
      } else if (toks.atLeastLength(1) &&
      toks.head[0] instanceof $tok.CloseArgs &&
      brackets === 0) {
        let pos = toks.head[1];
        let _pipe = new $err.ExtraCloseArgs(pos);
        return new Error(_pipe);
      } else if (toks.hasLength(1) && toks.head[0] instanceof $tok.CloseArgs) {
        let _pipe = new $err.MissingCloseArgs();
        return new Error(_pipe);
      } else if (toks.atLeastLength(1) && toks.head[0] instanceof $tok.CloseArgs) {
        let t = toks.head;
        let pos = toks.head[1];
        let rest = toks.tail;
        return get_args(
          rest,
          brackets - 1,
          (() => {
            let _pipe = acc;
            return add_to_arg(_pipe, t, pos);
          })(),
        );
      } else if (toks.atLeastLength(1) &&
      toks.head[0] instanceof $tok.ArgDelimiter &&
      brackets === 0) {
        let pos = toks.head[1];
        let rest = toks.tail;
        return get_args(
          rest,
          0,
          (() => {
            let _pipe = acc;
            return add_arg(_pipe, pos);
          })(),
        );
      } else if (toks.atLeastLength(1)) {
        let t = toks.head;
        let pos = toks.head[1];
        let rest = toks.tail;
        return get_args(
          rest,
          brackets,
          (() => {
            let _pipe = acc;
            return add_to_arg(_pipe, t, pos);
          })(),
        );
      } else {
        let _pipe = new $err.MissingCloseArgs();
        return new Error(_pipe);
      }
    },
  );
}

function parse_args(toks) {
  return guard(
    (() => {
      if (toks.hasLength(1) && toks.head[0] instanceof $tok.CloseArgs) {
        return true;
      } else {
        return false;
      }
    })(),
    new Ok(toList([])),
    () => {
      return try$(
        (() => {
          let _pipe = toks;
          let _pipe$1 = get_args(_pipe, 0, toList([]));
          return map_error(_pipe$1, (var0) => { return new $err.Arg(var0); });
        })(),
        (arg_list) => {
          let _pipe = arg_list;
          let _pipe$1 = reverse(_pipe);
          return try_map(
            _pipe$1,
            (arg) => {
              let arg_toks = arg[0];
              let from = arg[1];
              let to = arg[2];
              let $ = (() => {
                let _pipe$2 = arg_toks;
                let _pipe$3 = reverse(_pipe$2);
                return parse_invocation(_pipe$3);
              })();
              if (!$.isOk()) {
                let e = $[0];
                let _pipe$2 = e;
                let _pipe$3 = new $err.ArgInvocation(_pipe$2, from, to);
                let _pipe$4 = new $err.Arg(_pipe$3);
                return new Error(_pipe$4);
              } else {
                let invocation = $[0];
                let _pipe$2 = invocation;
                return new Ok(_pipe$2);
              }
            },
          );
        },
      );
    },
  );
}

export function parse_invocation(toks) {
  return guard(
    (() => {
      let _pipe = toks;
      return is_empty(_pipe);
    })(),
    (() => {
      let _pipe = new $err.EmptyInvocation();
      return new Error(_pipe);
    })(),
    () => {
      if (toks.atLeastLength(2) &&
      toks.head[0] instanceof $tok.Identifier &&
      toks.tail.head[0] instanceof $tok.OpenArgs) {
        let fname = toks.head[0][0];
        let rest = toks.tail.tail;
        let _pipe = rest;
        let _pipe$1 = parse_function(
          _pipe,
          (() => {
            let _pipe$1 = fname;
            return concat(_pipe$1);
          })(),
        );
        return map_error(
          _pipe$1,
          (e) => {
            let _pipe$2 = e;
            return new $err.Function(
              _pipe$2,
              (() => {
                let _pipe$3 = fname;
                return concat(_pipe$3);
              })(),
            );
          },
        );
      } else if (toks.atLeastLength(1) && toks.head[0] instanceof $tok.OpenArgs) {
        let pos = toks.head[1];
        let _pipe = new $err.MissingFunctionName(pos);
        let _pipe$1 = new $err.Function(_pipe, "");
        return new Error(_pipe$1);
      } else if (toks.atLeastLength(2) &&
      toks.head[0] instanceof $tok.Invalid &&
      toks.head[0][0] instanceof Some &&
      toks.tail.head[0] instanceof $tok.OpenArgs) {
        let invalid = toks.head;
        let fname = toks.head[0][0][0];
        let from = toks.head[1];
        let to = toks.tail.head[1];
        let _pipe = new $err.InvalidFunctionName(invalid, from, to);
        let _pipe$1 = new $err.Function(
          _pipe,
          (() => {
            let _pipe$1 = fname;
            return concat(_pipe$1);
          })(),
        );
        return new Error(_pipe$1);
      } else if (toks.hasLength(1) && toks.head[0] instanceof $tok.Identifier) {
        let interpolation = toks.head[0][0];
        let _pipe = new Interpolation(
          (() => {
            let _pipe = interpolation;
            return concat(_pipe);
          })(),
        );
        return new Ok(_pipe);
      } else if (toks.hasLength(3) &&
      toks.head[0] instanceof $tok.OpenString &&
      toks.tail.head[0] instanceof $tok.Text &&
      toks.tail.tail.head[0] instanceof $tok.CloseString) {
        let s = toks.tail.head[0][0];
        let _pipe = new StringInvocation(
          (() => {
            let _pipe = s;
            return concat(_pipe);
          })(),
        );
        return new Ok(_pipe);
      } else if (toks.hasLength(2) &&
      toks.head[0] instanceof $tok.OpenString &&
      toks.tail.head[0] instanceof $tok.CloseString) {
        let _pipe = new StringInvocation("");
        return new Ok(_pipe);
      } else if (toks.atLeastLength(1) &&
      toks.head[0] instanceof $tok.OpenString) {
        let _pipe = new $err.MissingCloseString();
        return new Error(_pipe);
      } else {
        let _pipe = new $err.InvalidInvocation(toks);
        return new Error(_pipe);
      }
    },
  );
}

function parse_function(toks, name) {
  return try$(
    (() => {
      let _pipe = toks;
      return parse_args(_pipe);
    })(),
    (args) => {
      let _pipe = new Function(
        name,
        (() => {
          let _pipe = args;
          return from_list(_pipe);
        })(),
      );
      return new Ok(_pipe);
    },
  );
}
