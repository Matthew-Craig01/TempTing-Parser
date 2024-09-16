/// <reference types="./parser.d.mts" />
import * as $io from "../../gleam_stdlib/gleam/io.mjs";
import { debug } from "../../gleam_stdlib/gleam/io.mjs";
import * as $list from "../../gleam_stdlib/gleam/list.mjs";
import { reverse } from "../../gleam_stdlib/gleam/list.mjs";
import * as $result from "../../gleam_stdlib/gleam/result.mjs";
import { all, map_error, try$ } from "../../gleam_stdlib/gleam/result.mjs";
import * as $string from "../../gleam_stdlib/gleam/string.mjs";
import { concat } from "../../gleam_stdlib/gleam/string.mjs";
import { Ok, Error, toList, prepend as listPrepend } from "../gleam.mjs";
import * as $err from "../parser/err.mjs";
import * as $slot from "../parser/internals/slot.mjs";
import { parse_slot } from "../parser/internals/slot.mjs";
import * as $template from "../parser/template.mjs";
import { FreeText, LexemeOrString, Punctuation } from "../parser/template.mjs";
import * as $tok from "../tok.mjs";
import * as $utils from "../utils.mjs";

function parse_(toks, acc) {
  return $utils.result_guard(
    (() => {
      let _pipe = toks;
      return $utils.get_first_rest(_pipe);
    })(),
    (() => {
      let _pipe = acc;
      return reverse(_pipe);
    })(),
    (_use0) => {
      let t = _use0[0][0];
      let from = _use0[0][1];
      let rest = _use0[1];
      if (t instanceof $tok.Punctuation) {
        let c = t[0];
        let _pipe = rest;
        return parse_(
          _pipe,
          listPrepend(
            (() => {
              let _pipe$1 = new Punctuation(c);
              let _pipe$2 = new FreeText(_pipe$1);
              return new Ok(_pipe$2);
            })(),
            acc,
          ),
        );
      } else if (t instanceof $tok.Text) {
        let cs = t[0];
        let _pipe = rest;
        return parse_(
          _pipe,
          listPrepend(
            (() => {
              let _pipe$1 = new LexemeOrString(
                (() => {
                  let _pipe$1 = cs;
                  return concat(_pipe$1);
                })(),
              );
              let _pipe$2 = new FreeText(_pipe$1);
              return new Ok(_pipe$2);
            })(),
            acc,
          ),
        );
      } else if (t instanceof $tok.OpenSlot) {
        let $ = (() => {
          let _pipe = rest;
          return parse_slot(_pipe);
        })();
        if (!$.isOk()) {
          let e = $[0];
          return listPrepend(
            (() => {
              let _pipe = e;
              let _pipe$1 = new $err.Slot(_pipe, from, from);
              return new Error(_pipe$1);
            })(),
            acc,
          );
        } else {
          let slot = $[0][0];
          let after = $[0][1];
          let to = $[0][2];
          let slot$1 = (() => {
            let _pipe = slot;
            return map_error(
              _pipe,
              (e) => {
                let _pipe$1 = e;
                return new $err.Slot(_pipe$1, from, to);
              },
            );
          })();
          let _pipe = after;
          return parse_(_pipe, listPrepend(slot$1, acc));
        }
      } else {
        let _pipe = rest;
        return parse_(
          _pipe,
          listPrepend(
            (() => {
              let _pipe$1 = new $err.InvalidElement(t, from);
              return new Error(_pipe$1);
            })(),
            acc,
          ),
        );
      }
    },
  );
}

export function parse(toks) {
  if (toks.hasLength(0)) {
    return toList([
      (() => {
        let _pipe = new $err.EmptyInput();
        return new Error(_pipe);
      })(),
    ]);
  } else {
    return parse_(toks, toList([]));
  }
}
