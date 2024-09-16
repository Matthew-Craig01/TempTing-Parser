/// <reference types="./lexer.d.mts" />
import * as $bool from "../../gleam_stdlib/gleam/bool.mjs";
import { guard } from "../../gleam_stdlib/gleam/bool.mjs";
import * as $list from "../../gleam_stdlib/gleam/list.mjs";
import { contains, fold, reverse } from "../../gleam_stdlib/gleam/list.mjs";
import * as $option from "../../gleam_stdlib/gleam/option.mjs";
import { None, Some } from "../../gleam_stdlib/gleam/option.mjs";
import * as $string from "../../gleam_stdlib/gleam/string.mjs";
import { to_graphemes } from "../../gleam_stdlib/gleam/string.mjs";
import { toList, isEqual } from "../gleam.mjs";
import * as $guard from "../lexer/internals/guard.mjs";
import * as $types from "../lexer/internals/types.mjs";
import { Lexer } from "../lexer/internals/types.mjs";
import * as $update from "../lexer/internals/update.mjs";
import * as $tok from "../tok.mjs";

function lex_with_lexer(input, lexer) {
  let _pipe = input;
  return fold(
    _pipe,
    lexer,
    (l, char) => {
      let _pipe$1 = l;
      let _pipe$2 = l.context(_pipe$1, char);
      return $update.increment(_pipe$2);
    },
  );
}

function lex_acc(l, context) {
  let $ = l.acc;
  if ($ instanceof None) {
    return l;
  } else {
    let acc = $[0][0];
    let pos = $[0][1];
    let lexed = (() => {
      let _pipe = acc;
      let _pipe$1 = reverse(_pipe);
      return lex_with_lexer(
        _pipe$1,
        new Lexer(l.tokens, new None(), pos, context),
      );
    })();
    return lexed;
  }
}

export const punctuation = /* @__PURE__ */ toList([
  ".",
  ",",
  "?",
  "!",
  ":",
  ";",
  "–",
  "—",
  "-",
  "(",
  ")",
  "[",
  "]",
  "'",
  "‚",
  "„",
  "「",
  "」",
  "『",
  "』",
  "′",
  "″",
  "`",
  "@",
  "|",
  "~",
  "«",
  "»",
  "¿",
  "¡",
  "\"",
]);

function slot(l, c) {
  return $guard.blacklist(
    l,
    c,
    toList(["{"]),
    () => {
      if (c === ":") {
        let l$1 = (() => {
          let _pipe = l;
          return lex_acc(_pipe, label);
        })();
        let _pipe = (() => {
          let $ = isEqual(l$1.context, index);
          if ($) {
            let _pipe = l$1;
            return $update.tokenise_acc(
              _pipe,
              (var0) => { return new $tok.Index(var0); },
            );
          } else {
            let _pipe = l$1;
            return $update.tokenise_acc_identifier(_pipe);
          }
        })();
        let _pipe$1 = $update.add_token(_pipe, new $tok.DependencyLabelSuffix());
        return $update.change_context(_pipe$1, slot);
      } else if (c === "}") {
        let _pipe = l;
        let _pipe$1 = lex_acc(_pipe, invocation);
        let _pipe$2 = $update.tokenise_acc_identifier(_pipe$1);
        let _pipe$3 = $update.add_token(_pipe$2, new $tok.CloseSlot());
        return $update.change_context(_pipe$3, element);
      } else {
        let _pipe = l;
        return $update.add_to_acc(_pipe, c);
      }
    },
  );
}

function element(l, c) {
  return $guard.whitespace(
    l,
    c,
    (var0) => { return new $tok.Text(var0); },
    () => {
      return $guard.blacklist(
        l,
        c,
        toList(["}"]),
        () => {
          if (c === "{") {
            let _pipe = l;
            let _pipe$1 = $update.tokenise_acc(
              _pipe,
              (var0) => { return new $tok.Text(var0); },
            );
            let _pipe$2 = $update.add_token(_pipe$1, new $tok.OpenSlot());
            return $update.change_context(_pipe$2, slot);
          } else {
            let $ = (() => {
              let _pipe = punctuation;
              return contains(_pipe, c);
            })();
            if ($) {
              let _pipe = l;
              let _pipe$1 = $update.tokenise_acc(
                _pipe,
                (var0) => { return new $tok.Text(var0); },
              );
              return $update.add_token(_pipe$1, new $tok.Punctuation(c));
            } else {
              let _pipe = l;
              return $update.add_to_acc(_pipe, c);
            }
          }
        },
      );
    },
  );
}

export function lex(input) {
  let l = (() => {
    let _pipe = input;
    let _pipe$1 = to_graphemes(_pipe);
    return lex_with_lexer(
      _pipe$1,
      new Lexer(toList([]), new None(), new $tok.Pos(1, 0, 0), element),
    );
  })();
  let l$1 = (() => {
    let _pipe = l;
    return l.context(_pipe, " ");
  })();
  let _pipe = l$1.tokens;
  return reverse(_pipe);
}

function string(l, c) {
  if (c === "\"") {
    let _pipe = l;
    let _pipe$1 = $update.tokenise_acc(
      _pipe,
      (var0) => { return new $tok.Text(var0); },
    );
    let _pipe$2 = $update.add_token(_pipe$1, new $tok.CloseString());
    return $update.change_context(_pipe$2, invocation);
  } else {
    let _pipe = l;
    return $update.add_to_acc(_pipe, c);
  }
}

function invocation(l, c) {
  return $guard.whitespace_identifier(
    l,
    c,
    () => {
      if (c === "(") {
        let _pipe = l;
        let _pipe$1 = $update.tokenise_acc_identifier(_pipe);
        return $update.add_token(_pipe$1, new $tok.OpenArgs());
      } else if (c === ")") {
        let _pipe = l;
        let _pipe$1 = $update.tokenise_acc_identifier(_pipe);
        return $update.add_token(_pipe$1, new $tok.CloseArgs());
      } else if (c === ",") {
        let _pipe = l;
        let _pipe$1 = $update.tokenise_acc_identifier(_pipe);
        return $update.add_token(_pipe$1, new $tok.ArgDelimiter());
      } else if (c === "\"") {
        let _pipe = (() => {
          let $ = l.acc;
          if ($ instanceof None) {
            return l;
          } else {
            let _pipe = l;
            let _pipe$1 = $update.add_to_acc(_pipe, c);
            return $update.tokenise_acc_identifier(_pipe$1);
          }
        })();
        let _pipe$1 = $update.add_token(_pipe, new $tok.OpenString());
        return $update.change_context(_pipe$1, string);
      } else {
        let _pipe = l;
        return $update.add_to_acc(_pipe, c);
      }
    },
  );
}

function index(l, c) {
  return $guard.whitespace(
    l,
    c,
    (var0) => { return new $tok.Index(var0); },
    () => {
      return $guard.whitelist(
        l,
        c,
        toList(["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "<"]),
        () => {
          if (c === "<") {
            let _pipe = l;
            let _pipe$1 = $update.tokenise_acc(
              _pipe,
              (var0) => { return new $tok.Index(var0); },
            );
            let _pipe$2 = $update.add_token(
              _pipe$1,
              new $tok.SourceLabelPrefix(),
            );
            return $update.change_context(_pipe$2, label);
          } else {
            let _pipe = l;
            return $update.add_to_acc(_pipe, c);
          }
        },
      );
    },
  );
}

function label(l, c) {
  return $guard.blacklist(
    l,
    c,
    toList([":", "(", ")", ","]),
    () => {
      return $guard.whitespace_identifier(
        l,
        c,
        () => {
          if (c === "_") {
            let _pipe = l;
            let _pipe$1 = $update.tokenise_acc_identifier(_pipe);
            let _pipe$2 = $update.add_token(_pipe$1, new $tok.IndexPrefix());
            return $update.change_context(_pipe$2, index);
          } else if (c === "<") {
            let _pipe = l;
            let _pipe$1 = $update.tokenise_acc_identifier(_pipe);
            return $update.add_token(_pipe$1, new $tok.SourceLabelPrefix());
          } else {
            let _pipe = l;
            return $update.add_to_acc(_pipe, c);
          }
        },
      );
    },
  );
}
