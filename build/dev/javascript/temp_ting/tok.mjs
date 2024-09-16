/// <reference types="./tok.d.mts" />
import * as $io from "../gleam_stdlib/gleam/io.mjs";
import { debug } from "../gleam_stdlib/gleam/io.mjs";
import * as $list from "../gleam_stdlib/gleam/list.mjs";
import { Continue, Stop, contains, reverse } from "../gleam_stdlib/gleam/list.mjs";
import * as $option from "../gleam_stdlib/gleam/option.mjs";
import * as $result from "../gleam_stdlib/gleam/result.mjs";
import { map_error, try$ } from "../gleam_stdlib/gleam/result.mjs";
import * as $string from "../gleam_stdlib/gleam/string.mjs";
import { concat } from "../gleam_stdlib/gleam/string.mjs";
import {
  Ok,
  Error,
  toList,
  prepend as listPrepend,
  CustomType as $CustomType,
  isEqual,
} from "./gleam.mjs";
import * as $utils from "./utils.mjs";

export class OpenSlot extends $CustomType {}

export class CloseSlot extends $CustomType {}

export class DependencyLabelSuffix extends $CustomType {}

export class Punctuation extends $CustomType {
  constructor(x0) {
    super();
    this[0] = x0;
  }
}

export class IndexPrefix extends $CustomType {}

export class SourceLabelPrefix extends $CustomType {}

export class Index extends $CustomType {
  constructor(x0) {
    super();
    this[0] = x0;
  }
}

export class Identifier extends $CustomType {
  constructor(x0) {
    super();
    this[0] = x0;
  }
}

export class Text extends $CustomType {
  constructor(x0) {
    super();
    this[0] = x0;
  }
}

export class Invalid extends $CustomType {
  constructor(x0, x1) {
    super();
    this[0] = x0;
    this[1] = x1;
  }
}

export class OpenString extends $CustomType {}

export class CloseString extends $CustomType {}

export class OpenArgs extends $CustomType {}

export class CloseArgs extends $CustomType {}

export class ArgDelimiter extends $CustomType {}

export class Pos extends $CustomType {
  constructor(ln, col, char) {
    super();
    this.ln = ln;
    this.col = col;
    this.char = char;
  }
}

function split_once_(loop$before, loop$after, loop$delim) {
  while (true) {
    let before = loop$before;
    let after = loop$after;
    let delim = loop$delim;
    if (after.hasLength(0)) {
      return new Error(undefined);
    } else {
      let first = after.head;
      let t = after.head[0];
      let pos = after.head[1];
      let rest = after.tail;
      let $ = isEqual(t, delim);
      if ($) {
        return new Ok([before, rest, pos]);
      } else {
        loop$before = listPrepend(first, before);
        loop$after = rest;
        loop$delim = delim;
      }
    }
  }
}

export function split_once(toks, delim) {
  return try$(
    split_once_(toList([]), toks, delim),
    (_use0) => {
      let before = _use0[0];
      let after = _use0[1];
      let pos = _use0[2];
      let _pipe = [
        (() => {
          let _pipe = before;
          return reverse(_pipe);
        })(),
        after,
        pos,
      ];
      return new Ok(_pipe);
    },
  );
}

export function to_string(tok) {
  if (tok instanceof OpenSlot) {
    return "{";
  } else if (tok instanceof CloseSlot) {
    return "}";
  } else if (tok instanceof DependencyLabelSuffix) {
    return ":";
  } else if (tok instanceof Punctuation) {
    let p = tok[0];
    return p;
  } else if (tok instanceof IndexPrefix) {
    return "_";
  } else if (tok instanceof SourceLabelPrefix) {
    return "<";
  } else if (tok instanceof Index) {
    let i = tok[0];
    let _pipe = i;
    return concat(_pipe);
  } else if (tok instanceof Identifier) {
    let i = tok[0];
    let _pipe = i;
    return concat(_pipe);
  } else if (tok instanceof Text) {
    let s = tok[0];
    let _pipe = s;
    return concat(_pipe);
  } else if (tok instanceof Invalid) {
    let c = tok[1];
    return c;
  } else if (tok instanceof OpenString) {
    return "\"";
  } else if (tok instanceof CloseString) {
    return "\"";
  } else if (tok instanceof OpenArgs) {
    return "(";
  } else if (tok instanceof CloseArgs) {
    return ")";
  } else {
    return ",";
  }
}

export function prev_pos(pos) {
  let ln = pos.ln;
  let col = pos.col;
  let chars = pos.char;
  if (ln === 1 && col === 0) {
    return new Pos(1, 0, 0);
  } else if (col === 0) {
    return new Pos(ln - 1, 0, chars - 1);
  } else {
    return new Pos(ln, col - 1, chars - 1);
  }
}

export function next_pos(pos) {
  let ln = pos.ln;
  let col = pos.col;
  let chars = pos.char;
  return new Pos(ln, col + 1, chars + 1);
}
