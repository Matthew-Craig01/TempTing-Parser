import type * as $option from "../../gleam_stdlib/gleam/option.d.mts";
import type * as $string from "../../gleam_stdlib/gleam/string.d.mts";
import type * as _ from "../gleam.d.mts";

export function equal<GJD>(a: GJD, b: GJD): undefined;

export function not_equal<GJE>(a: GJE, b: GJE): undefined;

export function be_ok<GJF>(a: _.Result<GJF, any>): GJF;

export function be_error<GJK>(a: _.Result<any, GJK>): GJK;

export function be_some<GJN>(a: $option.Option$<GJN>): GJN;

export function be_none(a: $option.Option$<any>): undefined;

export function be_true(actual: boolean): undefined;

export function be_false(actual: boolean): undefined;

export function fail(): undefined;
