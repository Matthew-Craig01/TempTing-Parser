/// <reference types="./gen_tree.d.mts" />
import * as $crypto from "../../gleam_crypto/gleam/crypto.mjs";
import * as $array from "../../gleam_javascript/gleam/javascript/array.mjs";
import { from_list } from "../../gleam_javascript/gleam/javascript/array.mjs";
import * as $bit_array from "../../gleam_stdlib/gleam/bit_array.mjs";
import * as $bool from "../../gleam_stdlib/gleam/bool.mjs";
import { negate } from "../../gleam_stdlib/gleam/bool.mjs";
import * as $dict from "../../gleam_stdlib/gleam/dict.mjs";
import * as $int from "../../gleam_stdlib/gleam/int.mjs";
import { random } from "../../gleam_stdlib/gleam/int.mjs";
import * as $io from "../../gleam_stdlib/gleam/io.mjs";
import { debug } from "../../gleam_stdlib/gleam/io.mjs";
import * as $list from "../../gleam_stdlib/gleam/list.mjs";
import { filter, map, range } from "../../gleam_stdlib/gleam/list.mjs";
import * as $result from "../../gleam_stdlib/gleam/result.mjs";
import * as $string from "../../gleam_stdlib/gleam/string.mjs";
import { Ok, toList, makeError } from "../gleam.mjs";
import * as $lexer from "../lexer/lexer.mjs";
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

export function gen_list(min, max) {
  let elem_count = random(max - min) + min;
  return range(0, elem_count);
}

export function random_string(min, max) {
  let len = random(max - min) + min;
  let str = (() => {
    let _pipe = $crypto.strong_random_bytes(len);
    let _pipe$1 = $bit_array.base64_url_encode(_pipe, false);
    return $string.slice(_pipe$1, 0, len);
  })();
  return str;
}

export function punctuation() {
  let len = $list.length($lexer.punctuation);
  let i = random(len);
  let d = (() => {
    let _pipe = $lexer.punctuation;
    let _pipe$1 = ((_capture) => { return $list.zip(range(0, len), _capture); })(
      _pipe,
    );
    return $dict.from_list(_pipe$1);
  })();
  let _pipe = d;
  let _pipe$1 = $dict.get(_pipe, i);
  return $result.lazy_unwrap(
    _pipe$1,
    () => {
      throw makeError(
        "panic",
        "evaluator/gen_tree",
        135,
        "",
        "panic expression evaluated",
        {}
      )
    },
  );
}

const banned = /* @__PURE__ */ toList([
  "_",
  ",",
  "<",
  ":",
  "\"",
  "{",
  "}",
  "(",
  ")",
  " ",
  "\n",
  "\t",
]);

export function identifier() {
  let str = random_string(1, 100);
  let nobanned = (() => {
    let _pipe = str;
    let _pipe$1 = $string.to_graphemes(_pipe);
    let _pipe$2 = filter(
      _pipe$1,
      (c) => {
        let _pipe$2 = banned;
        let _pipe$3 = $list.contains(_pipe$2, c);
        return negate(_pipe$3);
      },
    );
    return $string.concat(_pipe$2);
  })();
  if (nobanned === "") {
    return "x";
  } else {
    return nobanned;
  }
}

export function label() {
  return new Label(identifier(), random(10));
}

export function source() {
  let $ = random(2);
  if ($ === 0) {
    return new SourceLabel(label());
  } else if ($ === 1) {
    return new SourceRoot();
  } else {
    throw makeError(
      "panic",
      "evaluator/gen_tree",
      64,
      "source",
      "panic expression evaluated",
      {}
    )
  }
}

export function d_label() {
  let $ = random(2);
  if ($ === 0) {
    return new DependencyLabel(label(), source());
  } else if ($ === 1) {
    return new Root();
  } else {
    throw makeError(
      "panic",
      "evaluator/gen_tree",
      52,
      "d_label",
      "panic expression evaluated",
      {}
    )
  }
}

export function free_string() {
  let str = random_string(1, 100);
  let no_punc = (() => {
    let _pipe = str;
    let _pipe$1 = $string.to_graphemes(_pipe);
    let _pipe$2 = filter(
      _pipe$1,
      (c) => {
        return !((() => {
          let _pipe$2 = banned;
          return $list.contains(_pipe$2, c);
        })() || (() => {
          let _pipe$2 = $lexer.punctuation;
          return $list.contains(_pipe$2, c);
        })());
      },
    );
    return $string.concat(_pipe$2);
  })();
  if (no_punc === "") {
    return "x";
  } else {
    return no_punc;
  }
}

export function free_text() {
  let $ = random(2);
  if ($ === 0) {
    let _pipe = free_string();
    return new LexemeOrString(_pipe);
  } else if ($ === 1) {
    let _pipe = punctuation();
    return new Punctuation(_pipe);
  } else {
    throw makeError(
      "panic",
      "evaluator/gen_tree",
      113,
      "free_text",
      "panic expression evaluated",
      {}
    )
  }
}

export function function$(depth) {
  return new Function(
    identifier(),
    (() => {
      let _pipe = gen_list(0, 5);
      let _pipe$1 = map(_pipe, (_) => { return invocation(depth + 1); });
      return $array.from_list(_pipe$1);
    })(),
  );
}

export function invocation(depth) {
  let r = (() => {
    let $ = depth > 5;
    if ($) {
      return 2;
    } else {
      return 3;
    }
  })();
  let $ = random(r);
  if ($ === 0) {
    let _pipe = identifier();
    return new Interpolation(_pipe);
  } else if ($ === 1) {
    let _pipe = random_string(0, 100);
    return new StringInvocation(_pipe);
  } else if ($ === 2) {
    return function$(depth);
  } else {
    throw makeError(
      "panic",
      "evaluator/gen_tree",
      98,
      "invocation",
      "panic expression evaluated",
      {}
    )
  }
}

export function slot() {
  return new Slot(d_label(), invocation(0));
}

export function element() {
  let $ = random(2);
  if ($ === 0) {
    return slot();
  } else if ($ === 1) {
    let _pipe = free_text();
    return new FreeText(_pipe);
  } else {
    throw makeError(
      "panic",
      "evaluator/gen_tree",
      40,
      "element",
      "panic expression evaluated",
      {}
    )
  }
}

export function gen1() {
  let _pipe = gen_list(1, 100);
  let _pipe$1 = map(_pipe, (_) => { return element(); });
  return map(_pipe$1, (var0) => { return new Ok(var0); });
}

export function gen_n(n) {
  let _pipe = range(1, n);
  return map(_pipe, (_) => { return gen1(); });
}

export function gen_n_array(n) {
  let _pipe = gen_n(n);
  return $array.from_list(_pipe);
}
