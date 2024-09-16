/// <reference types="./get.d.mts" />
import * as $array from "../gleam_javascript/gleam/javascript/array.mjs";
import { fold, from_list } from "../gleam_javascript/gleam/javascript/array.mjs";
import * as $option from "../gleam_stdlib/gleam/option.mjs";
import { Some, None } from "../gleam_stdlib/gleam/option.mjs";
import { toList, prepend as listPrepend } from "./gleam.mjs";
import * as $template from "./parser/template.mjs";
import {
  DependencyLabel,
  FreeText,
  Function,
  Interpolation,
  Root,
  Slot,
  Label,
  SourceLabel,
  SourceRoot,
} from "./parser/template.mjs";

function get_roles_d_lbl(d_lbl, acc) {
  if (d_lbl instanceof DependencyLabel && d_lbl.label instanceof Label) {
    let rolea = d_lbl.label.role;
    let src = d_lbl.source;
    if (src instanceof SourceLabel && src.label instanceof Label) {
      let roleb = src.label.role;
      return listPrepend(rolea, listPrepend(roleb, acc));
    } else {
      return listPrepend(rolea, acc);
    }
  } else {
    return acc;
  }
}

export function get_roles(t) {
  return fold(
    t,
    toList([]),
    (acc, elem) => {
      if (elem instanceof FreeText) {
        return acc;
      } else {
        let d_lbl = elem.dependency_label;
        return get_roles_d_lbl(d_lbl, acc);
      }
    },
  );
}

function get_args_function(args, acc) {
  let _pipe = args;
  return fold(_pipe, acc, (acc, i) => { return get_args_invocation(i, acc); });
}

function get_args_invocation(i, acc) {
  if (i instanceof Function) {
    let args = i.args;
    return get_args_function(args, acc);
  } else if (i instanceof Interpolation) {
    let interpolation = i.interpolation;
    return listPrepend(interpolation, acc);
  } else {
    return acc;
  }
}

export function get_args(t) {
  return fold(
    t,
    toList([]),
    (acc, elem) => {
      if (elem instanceof FreeText) {
        return acc;
      } else {
        let invocation = elem.invocation;
        return get_args_invocation(invocation, acc);
      }
    },
  );
}
