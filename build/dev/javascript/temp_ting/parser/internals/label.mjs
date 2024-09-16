/// <reference types="./label.d.mts" />
import * as $bool from "../../../gleam_stdlib/gleam/bool.mjs";
import { guard } from "../../../gleam_stdlib/gleam/bool.mjs";
import * as $int from "../../../gleam_stdlib/gleam/int.mjs";
import * as $list from "../../../gleam_stdlib/gleam/list.mjs";
import { is_empty } from "../../../gleam_stdlib/gleam/list.mjs";
import * as $option from "../../../gleam_stdlib/gleam/option.mjs";
import { None, Some } from "../../../gleam_stdlib/gleam/option.mjs";
import * as $pair from "../../../gleam_stdlib/gleam/pair.mjs";
import * as $result from "../../../gleam_stdlib/gleam/result.mjs";
import { map_error, try$ } from "../../../gleam_stdlib/gleam/result.mjs";
import * as $string from "../../../gleam_stdlib/gleam/string.mjs";
import { concat } from "../../../gleam_stdlib/gleam/string.mjs";
import { Ok, Error } from "../../gleam.mjs";
import * as $err from "../../parser/err.mjs";
import * as $template from "../../parser/template.mjs";
import { DependencyLabel, Label, Root, SourceLabel, SourceRoot } from "../../parser/template.mjs";
import * as $tok from "../../tok.mjs";

function parse_index(toks, to) {
  let $ = (() => {
    let _pipe = toks;
    return $tok.split_once(_pipe, new $tok.IndexPrefix());
  })();
  if (!$.isOk() && !$[0]) {
    let _pipe = [toks, 0, to];
    return new Ok(_pipe);
  } else {
    let before = $[0][0];
    let i_toks = $[0][1];
    let role_to = $[0][2];
    if (i_toks.hasLength(1) && i_toks.head[0] instanceof $tok.Index) {
      let i = i_toks.head[0][0];
      let from = i_toks.head[1];
      return try$(
        (() => {
          let _pipe = i;
          let _pipe$1 = concat(_pipe);
          let _pipe$2 = $int.parse(_pipe$1);
          return map_error(
            _pipe$2,
            (_) => { return new $err.InvalidIndex(i_toks, from, to); },
          );
        })(),
        (as_int) => {
          let _pipe = [before, as_int, role_to];
          return new Ok(_pipe);
        },
      );
    } else if (i_toks.atLeastLength(1)) {
      let from = i_toks.head[1];
      let _pipe = new $err.InvalidIndex(i_toks, from, to);
      return new Error(_pipe);
    } else {
      let _pipe = new $err.EmptyIndex(to);
      return new Error(_pipe);
    }
  }
}

function parse_role(toks, to) {
  if (toks.hasLength(1) && toks.head[0] instanceof $tok.Identifier) {
    let role = toks.head[0][0];
    let _pipe = role;
    return new Ok(_pipe);
  } else if (toks.hasLength(0)) {
    let _pipe = new $err.EmptyRole(to);
    return new Error(_pipe);
  } else {
    let from = toks.head[1];
    let _pipe = new $err.InvalidRole(toks, from, to);
    return new Error(_pipe);
  }
}

function parse_label(toks, to) {
  return guard(
    (() => {
      let _pipe = toks;
      return is_empty(_pipe);
    })(),
    (() => {
      let _pipe = new $err.EmptyLabel(to);
      return new Error(_pipe);
    })(),
    () => {
      return try$(
        (() => {
          let _pipe = toks;
          let _pipe$1 = parse_index(_pipe, to);
          return map_error(_pipe$1, (var0) => { return new $err.Index(var0); });
        })(),
        (_use0) => {
          let before = _use0[0];
          let index = _use0[1];
          let to_role = _use0[2];
          return try$(
            (() => {
              let _pipe = before;
              let _pipe$1 = parse_role(_pipe, to_role);
              return map_error(
                _pipe$1,
                (var0) => { return new $err.Role(var0); },
              );
            })(),
            (role) => {
              let _pipe = new Label(
                (() => {
                  let _pipe = role;
                  return concat(_pipe);
                })(),
                index,
              );
              return new Ok(_pipe);
            },
          );
        },
      );
    },
  );
}

function parse_source_label(toks, to) {
  let $ = (() => {
    let _pipe = toks;
    return $tok.split_once(_pipe, new $tok.SourceLabelPrefix());
  })();
  if (!$.isOk() && !$[0]) {
    let _pipe = [toks, new SourceRoot(), to];
    return new Ok(_pipe);
  } else {
    let before = $[0][0];
    let l_toks = $[0][1];
    let from = $[0][2];
    return try$(
      (() => {
        let _pipe = l_toks;
        let _pipe$1 = parse_label(_pipe, to);
        return map_error(_pipe$1, (e) => { return [e, from]; });
      })(),
      (label) => {
        let src_lbl = (() => {
          if (label instanceof Label && label.role === "root") {
            return new SourceRoot();
          } else {
            return new SourceLabel(label);
          }
        })();
        let _pipe = [before, src_lbl, from];
        return new Ok(_pipe);
      },
    );
  }
}

function parse_dependency_label_(toks, to) {
  return guard(
    (() => {
      let _pipe = toks;
      return is_empty(_pipe);
    })(),
    (() => {
      let _pipe = new $err.EmptyLabel(to);
      return new Error(_pipe);
    })(),
    () => {
      return try$(
        (() => {
          let _pipe = toks;
          let _pipe$1 = parse_source_label(_pipe, to);
          return map_error(
            _pipe$1,
            (e) => {
              return new $err.SourceLabel(
                (() => {
                  let _pipe$2 = e;
                  return $pair.first(_pipe$2);
                })(),
                (() => {
                  let _pipe$2 = e;
                  return $pair.second(_pipe$2);
                })(),
              );
            },
          );
        })(),
        (_use0) => {
          let before = _use0[0];
          let source_label = _use0[1];
          let label_to = _use0[2];
          return try$(
            (() => {
              let _pipe = before;
              return parse_label(_pipe, label_to);
            })(),
            (label) => {
              let _pipe = (() => {
                if (label instanceof Label && label.role === "root") {
                  return new Root();
                } else {
                  return new DependencyLabel(label, source_label);
                }
              })();
              return new Ok(_pipe);
            },
          );
        },
      );
    },
  );
}

export function parse_dependency_label(toks, slot_from) {
  let $ = (() => {
    let _pipe = toks;
    return $tok.split_once(_pipe, new $tok.DependencyLabelSuffix());
  })();
  if (!$.isOk() && !$[0]) {
    let _pipe = [new Root(), toks, slot_from];
    return new Ok(_pipe);
  } else {
    let dl = $[0][0];
    let after = $[0][1];
    let to = $[0][2];
    return try$(
      parse_dependency_label_(dl, to),
      (parsed) => {
        let _pipe = [parsed, after, to];
        return new Ok(_pipe);
      },
    );
  }
}
