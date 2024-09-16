/// <reference types="./err.d.mts" />
import * as $int from "../../gleam_stdlib/gleam/int.mjs";
import * as $list from "../../gleam_stdlib/gleam/list.mjs";
import { Continue, Stop, fold_until, map } from "../../gleam_stdlib/gleam/list.mjs";
import * as $option from "../../gleam_stdlib/gleam/option.mjs";
import { None, Some } from "../../gleam_stdlib/gleam/option.mjs";
import * as $string from "../../gleam_stdlib/gleam/string.mjs";
import { concat } from "../../gleam_stdlib/gleam/string.mjs";
import { Ok, Error, toList, CustomType as $CustomType } from "../gleam.mjs";
import * as $tok from "../tok.mjs";

export class EmptyInput extends $CustomType {}

export class Slot extends $CustomType {
  constructor(x0, x1, x2) {
    super();
    this[0] = x0;
    this[1] = x1;
    this[2] = x2;
  }
}

export class InvalidElement extends $CustomType {
  constructor(x0, x1) {
    super();
    this[0] = x0;
    this[1] = x1;
  }
}

export class MissingCloseBrace extends $CustomType {}

export class EmptySlot extends $CustomType {}

export class DependencyLabel extends $CustomType {
  constructor(x0) {
    super();
    this[0] = x0;
  }
}

export class Invocation extends $CustomType {
  constructor(x0, x1, x2) {
    super();
    this[0] = x0;
    this[1] = x1;
    this[2] = x2;
  }
}

export class EmptyLabel extends $CustomType {
  constructor(x0) {
    super();
    this[0] = x0;
  }
}

export class Role extends $CustomType {
  constructor(x0) {
    super();
    this[0] = x0;
  }
}

export class Index extends $CustomType {
  constructor(x0) {
    super();
    this[0] = x0;
  }
}

export class SourceLabel extends $CustomType {
  constructor(x0, x1) {
    super();
    this[0] = x0;
    this[1] = x1;
  }
}

export class InvalidIndex extends $CustomType {
  constructor(x0, x1, x2) {
    super();
    this[0] = x0;
    this[1] = x1;
    this[2] = x2;
  }
}

export class EmptyIndex extends $CustomType {
  constructor(x0) {
    super();
    this[0] = x0;
  }
}

export class InvalidRole extends $CustomType {
  constructor(x0, x1, x2) {
    super();
    this[0] = x0;
    this[1] = x1;
    this[2] = x2;
  }
}

export class EmptyRole extends $CustomType {
  constructor(x0) {
    super();
    this[0] = x0;
  }
}

export class EmptyInvocation extends $CustomType {}

export class Function extends $CustomType {
  constructor(x0, name) {
    super();
    this[0] = x0;
    this.name = name;
  }
}

export class MissingCloseString extends $CustomType {}

export class InvalidInvocation extends $CustomType {
  constructor(x0) {
    super();
    this[0] = x0;
  }
}

export class MissingFunctionName extends $CustomType {
  constructor(x0) {
    super();
    this[0] = x0;
  }
}

export class InvalidFunctionName extends $CustomType {
  constructor(x0, x1, x2) {
    super();
    this[0] = x0;
    this[1] = x1;
    this[2] = x2;
  }
}

export class Arg extends $CustomType {
  constructor(x0) {
    super();
    this[0] = x0;
  }
}

export class MissingCloseArgs extends $CustomType {}

export class ExtraCloseArgs extends $CustomType {
  constructor(x0) {
    super();
    this[0] = x0;
  }
}

export class ArgInvocation extends $CustomType {
  constructor(x0, x1, x2) {
    super();
    this[0] = x0;
    this[1] = x1;
    this[2] = x2;
  }
}

export class Msg extends $CustomType {
  constructor(msg, from, to) {
    super();
    this.msg = msg;
    this.from = from;
    this.to = to;
  }
}

function find_invalid(toks) {
  let _pipe = toks;
  return fold_until(
    _pipe,
    new Error(undefined),
    (_, t) => {
      if (t[0] instanceof $tok.Invalid) {
        let opt = t[0][0];
        let c = t[0][1];
        let pos = t[1];
        let _pipe$1 = [opt, c, pos];
        let _pipe$2 = new Ok(_pipe$1);
        return new Stop(_pipe$2);
      } else {
        let _pipe$1 = new Error(undefined);
        return new Continue(_pipe$1);
      }
    },
  );
}

function pos_to_string(pos) {
  let ln = pos.ln;
  let col = pos.col;
  return ((() => {
    let _pipe = ln;
    return $int.to_string(_pipe);
  })() + ":") + (() => {
    let _pipe = col;
    return $int.to_string(_pipe);
  })();
}

function backticks(s) {
  return ("`" + s) + "'";
}

const multi_word = "Separation of multi-word identifiers can be done with \ncamelCase (capitaliseEachWord) \nor kebab-case (put-a-hyphen-between-each-word).";

function invalid_tip(c, type_string) {
  let args_tip = "TIP:\n`(` and `)` are used to enclose function arguments.\nFunction arguments can be either:\nOne of the Template's arguments.\n  or\nA string (eg. \"this is a string.\").\n  or\nA nested function (eg. `my-template()`).";
  if (c === "}") {
    return "TIP: Slots are not nestable.";
  } else if (c === "<") {
    return "TIP: `<` is prefixed before source labels.";
  } else if (c === "_") {
    return "TIP: `_` is prefixed before role indexes.\n" + multi_word;
  } else if (c === ":") {
    return "TIP: `:` is used to separate dependency labels (left) and invocations (right).";
  } else if (c === "\"") {
    return "TIP: `\"` must surround a string invocation.";
  } else if (c === ",") {
    return "TIP: `,` is used to separate arguments in a function call.";
  } else if (c === "(") {
    return args_tip;
  } else if (c === ")") {
    return args_tip;
  } else if (c === " ") {
    return (("TIP: " + type_string) + " cannot contain whitespace.") + multi_word;
  } else if (c === "\n") {
    return (("TIP: " + type_string) + " cannot contain whitespace.") + multi_word;
  } else if (c === "\t") {
    return (("TIP: " + type_string) + " cannot contain whitespace.") + multi_word;
  } else {
    return "";
  }
}

function invalid_err(toks, type_string, format, from, to) {
  let invalid_format = ((("Invalid " + type_string) + " format:\nFormat must be in the form:\n") + format) + "\n\n";
  let $ = find_invalid(toks);
  if ($.isOk()) {
    let opt = $[0][0];
    let c = $[0][1];
    let pre = (() => {
      if (opt instanceof Some) {
        let chars = opt[0];
        return ((type_string + ": ") + (() => {
          let _pipe = chars;
          return concat(_pipe);
        })()) + "\n";
      } else {
        return "";
      }
    })();
    let tip = invalid_tip(c, type_string);
    let err = (((() => {
      let _pipe = c;
      return backticks(_pipe);
    })() + " is not a valid character for ") + type_string) + ".\n\n";
    return new Msg(((pre + err) + invalid_format) + tip, from, to);
  } else {
    return new Msg(invalid_format, from, to);
  }
}

export function role_to_msg(e) {
  let format = "One word identifier. eg. `nummod` or `noun`";
  if (e instanceof InvalidRole) {
    let toks = e[0];
    let from = e[1];
    let to = e[2];
    return invalid_err(toks, "Role", format, from, to);
  } else {
    let pos = e[0];
    return new Msg("Role is empty.", pos, pos);
  }
}

export function index_to_msg(e) {
  let format = "Indexes can only contain digits from 0-9.";
  let tip = " `_` must be followed by a number stating the role's index.\nTIP: The index indicates precedance when multiple roles share the same identifier.\n" + multi_word;
  if (e instanceof EmptyIndex) {
    let pos = e[0];
    return new Msg(("Index is empty." + tip) + format, pos, pos);
  } else {
    let toks = e[0];
    let from = e[1];
    let to = e[2];
    return invalid_err(toks, "Index", format + tip, from, to);
  }
}

export function label_to_msg(loop$e, loop$from) {
  while (true) {
    let e = loop$e;
    let from = loop$from;
    if (e instanceof EmptyLabel) {
      let pos = e[0];
      return new Msg(
        "Label is Empty.",
        (() => {
          let _pipe = from;
          return $tok.next_pos(_pipe);
        })(),
        pos,
      );
    } else if (e instanceof Role) {
      let e$1 = e[0];
      let _pipe = e$1;
      return role_to_msg(_pipe);
    } else if (e instanceof Index) {
      let e$1 = e[0];
      let _pipe = e$1;
      return index_to_msg(_pipe);
    } else {
      let e$1 = e[0];
      let src_from = e[1];
      let _pipe = e$1;
      loop$e = _pipe;
      loop$from = src_from;
    }
  }
}

export function arg_to_msg(e, from, to) {
  if (e instanceof MissingCloseArgs) {
    return new Msg("Function arguments are not closed. Missing `)`", from, to);
  } else if (e instanceof ExtraCloseArgs) {
    let pos = e[0];
    return new Msg(
      "Extra `)` encountered. Perhaps you forgot to include `(` to open a nested function call?",
      pos,
      pos,
    );
  } else {
    let e$1 = e[0];
    let arg_from = e[1];
    let arg_to = e[2];
    let _pipe = e$1;
    return invocation_to_msg(_pipe, arg_from, arg_to);
  }
}

export function invocation_to_msg(e, from, to) {
  let format = "Function (eg. sub-template)\n  or\nInterpolation of argument\n  or\nString";
  if (e instanceof EmptyInvocation) {
    return new Msg(
      "Invocation is empty.\nInvocation's are either:\n" + format,
      (() => {
        let _pipe = from;
        return $tok.next_pos(_pipe);
      })(),
      (() => {
        let _pipe = to;
        return $tok.prev_pos(_pipe);
      })(),
    );
  } else if (e instanceof Function) {
    let e$1 = e[0];
    let name = e.name;
    let _pipe = e$1;
    return function_to_msg(_pipe, name, from, to);
  } else if (e instanceof MissingCloseString) {
    return new Msg("String is missing closing `\"`", from, to);
  } else {
    let toks = e[0];
    let _pipe = toks;
    return invalid_err(_pipe, "Invocation", format, from, to);
  }
}

export function function_to_msg(e, name, from, to) {
  let pre = ("Error with function " + (() => {
    let _pipe = name;
    return backticks(_pipe);
  })()) + ":\n";
  let format = "One word identifier. It can be the name of another template, which will invoke it as a sub-template";
  if (e instanceof MissingFunctionName) {
    let pos = e[0];
    return new Msg("Function (sub-template) is missing a name.", pos, pos);
  } else if (e instanceof InvalidFunctionName) {
    let tok = e[0];
    let fname_from = e[1];
    let fname_to = e[2];
    return invalid_err(
      toList([tok]),
      "Function name",
      format,
      fname_from,
      fname_to,
    );
  } else {
    let e$1 = e[0];
    let $ = (() => {
      let _pipe = e$1;
      return arg_to_msg(_pipe, from, to);
    })();
    let m = $;
    let s = $.msg;
    return m.withFields({ msg: pre + s });
  }
}

export function slot_to_msg(e, from, to) {
  if (e instanceof MissingCloseBrace) {
    return new Msg("Slot is not closed. Missing `}`", from, to);
  } else if (e instanceof EmptySlot) {
    return new Msg("Slot is empty", from, to);
  } else if (e instanceof DependencyLabel) {
    let l = e[0];
    return label_to_msg(l, from);
  } else {
    let e$1 = e[0];
    let f = e[1];
    let t = e[2];
    let _pipe = e$1;
    return invocation_to_msg(_pipe, f, t);
  }
}

export function to_msg(e) {
  let format = "\n{slot} lexeme {slot} punctuation\n";
  let $ = (() => {
    if (e instanceof EmptyInput) {
      return new Msg(
        "Empty input",
        new $tok.Pos(1, 0, 0),
        new $tok.Pos(1, 0, 0),
      );
    } else if (e instanceof InvalidElement &&
    e[0] instanceof $tok.Invalid &&
    e[0][1] === "}") {
      let pos = e[1];
      return new Msg(
        "Additional `}` found. Slots must be enclosed between `{` and `}`. Did you forget to include an opening `{` ?",
        pos,
        pos,
      );
    } else if (e instanceof InvalidElement) {
      let t = e[0];
      let pos = e[1];
      return invalid_err(toList([[t, pos]]), "Element", format, pos, pos);
    } else {
      let e$1 = e[0];
      let from = e[1];
      let to = e[2];
      let _pipe = e$1;
      return slot_to_msg(_pipe, from, to);
    }
  })();
  let s = $.msg;
  let from = $.from;
  let to = $.to;
  return new Msg("Syntax Error:\n\n" + s, from, to);
}

export function to_string(e) {
  let $ = (() => {
    let _pipe = e;
    return to_msg(_pipe);
  })();
  let s = $.msg;
  let from = $.from;
  let to = $.to;
  return ((((() => {
    let _pipe = from;
    return pos_to_string(_pipe);
  })() + " -> ") + (() => {
    let _pipe = to;
    return pos_to_string(_pipe);
  })()) + "\n") + s;
}
