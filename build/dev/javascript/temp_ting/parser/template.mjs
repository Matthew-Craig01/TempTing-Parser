/// <reference types="./template.d.mts" />
import * as $array from "../../gleam_javascript/gleam/javascript/array.mjs";
import { CustomType as $CustomType } from "../gleam.mjs";
import * as $err from "../parser/err.mjs";

export class Slot extends $CustomType {
  constructor(dependency_label, invocation) {
    super();
    this.dependency_label = dependency_label;
    this.invocation = invocation;
  }
}

export class FreeText extends $CustomType {
  constructor(text) {
    super();
    this.text = text;
  }
}

export class LexemeOrString extends $CustomType {
  constructor(lexeme_or_string) {
    super();
    this.lexeme_or_string = lexeme_or_string;
  }
}

export class Punctuation extends $CustomType {
  constructor(punctuation) {
    super();
    this.punctuation = punctuation;
  }
}

export class DependencyLabel extends $CustomType {
  constructor(label, source) {
    super();
    this.label = label;
    this.source = source;
  }
}

export class Root extends $CustomType {}

export class SourceLabel extends $CustomType {
  constructor(label) {
    super();
    this.label = label;
  }
}

export class SourceRoot extends $CustomType {}

export class Label extends $CustomType {
  constructor(role, index) {
    super();
    this.role = role;
    this.index = index;
  }
}

export class Function extends $CustomType {
  constructor(name, args) {
    super();
    this.name = name;
    this.args = args;
  }
}

export class Interpolation extends $CustomType {
  constructor(interpolation) {
    super();
    this.interpolation = interpolation;
  }
}

export class StringInvocation extends $CustomType {
  constructor(string) {
    super();
    this.string = string;
  }
}
