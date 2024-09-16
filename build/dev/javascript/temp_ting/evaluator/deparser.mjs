/// <reference types="./deparser.d.mts" />
import * as $array from "../../gleam_javascript/gleam/javascript/array.mjs";
import * as $int from "../../gleam_stdlib/gleam/int.mjs";
import { random } from "../../gleam_stdlib/gleam/int.mjs";
import * as $io from "../../gleam_stdlib/gleam/io.mjs";
import { debug } from "../../gleam_stdlib/gleam/io.mjs";
import * as $list from "../../gleam_stdlib/gleam/list.mjs";
import * as $result from "../../gleam_stdlib/gleam/result.mjs";
import * as $string from "../../gleam_stdlib/gleam/string.mjs";
import { Ok, makeError } from "../gleam.mjs";
import * as $template from "../parser/template.mjs";
import {
  DependencyLabel,
  FreeText,
  Function,
  Interpolation,
  Label,
  LexemeOrString,
  Punctuation,
  Root,
  Slot,
  SourceLabel,
  SourceRoot,
  StringInvocation,
} from "../parser/template.mjs";

export function whitespace() {
  let n = random(5);
  let _pipe = $list.range(0, n);
  let _pipe$1 = $list.map(
    _pipe,
    (_) => {
      let $ = random(4);
      if ($ === 0) {
        return "";
      } else if ($ === 1) {
        return " ";
      } else if ($ === 2) {
        return "\n";
      } else if ($ === 3) {
        return "\t";
      } else {
        throw makeError(
          "panic",
          "evaluator/deparser",
          28,
          "",
          "panic expression evaluated",
          {}
        )
      }
    },
  );
  return $string.concat(_pipe$1);
}

export function index(i) {
  if (i === 0) {
    return "";
  } else {
    return "_" + (() => {
      let _pipe = i;
      return $int.to_string(_pipe);
    })();
  }
}

export function label(l) {
  let r = l.role;
  let i = l.index;
  return (r + whitespace()) + index(i);
}

export function root() {
  let $ = random(2);
  if ($ === 0) {
    return "";
  } else if ($ === 1) {
    return ("root" + whitespace()) + ":";
  } else {
    throw makeError(
      "panic",
      "evaluator/deparser",
      81,
      "root",
      "panic expression evaluated",
      {}
    )
  }
}

export function src_root() {
  let $ = random(2);
  if ($ === 0) {
    return "";
  } else if ($ === 1) {
    return ("<" + whitespace()) + "root";
  } else {
    throw makeError(
      "panic",
      "evaluator/deparser",
      90,
      "src_root",
      "panic expression evaluated",
      {}
    )
  }
}

export function source(s) {
  if (s instanceof SourceLabel) {
    let l = s.label;
    return ("<" + whitespace()) + label(l);
  } else {
    return src_root();
  }
}

export function dependency_label(d) {
  if (d instanceof DependencyLabel) {
    let l = d.label;
    let s = d.source;
    return (((label(l) + whitespace()) + source(s)) + whitespace()) + ":";
  } else {
    return root();
  }
}

export function delim() {
  let $ = random(4);
  if ($ === 0) {
    return ",";
  } else if ($ === 1) {
    return whitespace() + ",";
  } else if ($ === 2) {
    return (whitespace() + ",") + whitespace();
  } else if ($ === 3) {
    return "," + whitespace();
  } else {
    throw makeError(
      "panic",
      "evaluator/deparser",
      113,
      "delim",
      "panic expression evaluated",
      {}
    )
  }
}

export function free_text(f) {
  if (f instanceof LexemeOrString) {
    let s = f.lexeme_or_string;
    return " " + s;
  } else {
    let s = f.punctuation;
    return s;
  }
}

export function function$(name, args) {
  let arg_str = (() => {
    let _pipe = args;
    let _pipe$1 = $array.to_list(_pipe);
    let _pipe$2 = $list.map(_pipe$1, invocation);
    return $string.join(_pipe$2, delim());
  })();
  return (((((name + whitespace()) + "(") + whitespace()) + arg_str) + whitespace()) + ")";
}

export function invocation(i) {
  if (i instanceof Function) {
    let name = i.name;
    let args = i.args;
    return function$(name, args);
  } else if (i instanceof Interpolation) {
    let i$1 = i.interpolation;
    return i$1;
  } else {
    let s = i.string;
    return ("\"" + s) + "\"";
  }
}

export function slot(d, i) {
  return ((((("{" + whitespace()) + dependency_label(d)) + whitespace()) + invocation(
    i,
  )) + whitespace()) + "}";
}

export function element(e) {
  if (e instanceof Slot) {
    let d = e.dependency_label;
    let i = e.invocation;
    return slot(d, i);
  } else {
    let ft = e.text;
    return free_text(ft);
  }
}

export function deparse(t) {
  return $result.try$(
    (() => {
      let _pipe = t;
      let _pipe$1 = $result.all(_pipe);
      return $result.map_error(_pipe$1, (_) => { return undefined; });
    })(),
    (elems) => {
      let _pipe = elems;
      let _pipe$1 = $list.map(_pipe, element);
      let _pipe$2 = $string.join(_pipe$1, whitespace());
      return new Ok(_pipe$2);
    },
  );
}
