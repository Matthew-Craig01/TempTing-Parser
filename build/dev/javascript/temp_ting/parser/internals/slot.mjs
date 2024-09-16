/// <reference types="./slot.d.mts" />
import * as $bool from "../../../gleam_stdlib/gleam/bool.mjs";
import { guard } from "../../../gleam_stdlib/gleam/bool.mjs";
import * as $io from "../../../gleam_stdlib/gleam/io.mjs";
import { debug } from "../../../gleam_stdlib/gleam/io.mjs";
import * as $list from "../../../gleam_stdlib/gleam/list.mjs";
import { is_empty } from "../../../gleam_stdlib/gleam/list.mjs";
import * as $result from "../../../gleam_stdlib/gleam/result.mjs";
import { map_error, try$ } from "../../../gleam_stdlib/gleam/result.mjs";
import { Ok, Error } from "../../gleam.mjs";
import * as $err from "../../parser/err.mjs";
import * as $invocation from "../../parser/internals/invocation.mjs";
import { parse_invocation } from "../../parser/internals/invocation.mjs";
import * as $label from "../../parser/internals/label.mjs";
import { parse_dependency_label } from "../../parser/internals/label.mjs";
import * as $template from "../../parser/template.mjs";
import { Slot } from "../../parser/template.mjs";
import * as $tok from "../../tok.mjs";

function parse_slot_(toks, slot_to) {
  return try$(
    (() => {
      let _pipe = toks;
      let _pipe$1 = $list.first(_pipe);
      return map_error(_pipe$1, (_) => { return new $err.EmptySlot(); });
    })(),
    (_use0) => {
      let slot_from = _use0[1];
      return try$(
        (() => {
          let _pipe = toks;
          let _pipe$1 = parse_dependency_label(_pipe, slot_from);
          return map_error(
            _pipe$1,
            (e) => {
              let _pipe$2 = e;
              return new $err.DependencyLabel(_pipe$2);
            },
          );
        })(),
        (_use0) => {
          let dependency_label = _use0[0];
          let after_dl = _use0[1];
          let invoc_from = _use0[2];
          return guard(
            (() => {
              let _pipe = after_dl;
              return is_empty(_pipe);
            })(),
            (() => {
              let _pipe = new $err.EmptyInvocation();
              let _pipe$1 = new $err.Invocation(_pipe, invoc_from, slot_to);
              return new Error(_pipe$1);
            })(),
            () => {
              return try$(
                (() => {
                  let _pipe = after_dl;
                  let _pipe$1 = parse_invocation(_pipe);
                  return map_error(
                    _pipe$1,
                    (e) => {
                      let _pipe$2 = e;
                      return new $err.Invocation(_pipe$2, invoc_from, slot_to);
                    },
                  );
                })(),
                (invocation) => {
                  let _pipe = new Slot(dependency_label, invocation);
                  return new Ok(_pipe);
                },
              );
            },
          );
        },
      );
    },
  );
}

export function parse_slot(toks) {
  let $ = (() => {
    let _pipe = toks;
    return $tok.split_once(_pipe, new $tok.CloseSlot());
  })();
  if (!$.isOk() && !$[0]) {
    let _pipe = new $err.MissingCloseBrace();
    return new Error(_pipe);
  } else {
    let slot = $[0][0];
    let after = $[0][1];
    let to = $[0][2];
    let parsed = parse_slot_(slot, to);
    let _pipe = [parsed, after, to];
    return new Ok(_pipe);
  }
}
