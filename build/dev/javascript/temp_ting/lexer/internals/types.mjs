/// <reference types="./types.d.mts" />
import * as $option from "../../../gleam_stdlib/gleam/option.mjs";
import { CustomType as $CustomType } from "../../gleam.mjs";
import * as $tok from "../../tok.mjs";

export class Lexer extends $CustomType {
  constructor(tokens, acc, pos, context) {
    super();
    this.tokens = tokens;
    this.acc = acc;
    this.pos = pos;
    this.context = context;
  }
}
