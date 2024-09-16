import type * as _ from "../../gleam.d.mts";

export type Array$<FWH> = any;

export function from_list<FWL>(a: _.List<FWL>): Array$<FWL>;

export function size(a: Array$<any>): number;

export function map<FWQ, FWS>(a: Array$<FWQ>, with$: (x0: FWQ) => FWS): Array$<
  FWS
>;

export function fold<FWU, FWW>(
  over: Array$<FWU>,
  from: FWW,
  with$: (x0: FWW, x1: FWU) => FWW
): FWW;

export function fold_right<FWX, FWZ>(
  over: Array$<FWX>,
  from: FWZ,
  with$: (x0: FWZ, x1: FWX) => FWZ
): FWZ;

export function to_list<FWI>(items: Array$<FWI>): _.List<FWI>;

export function get<FXA>(a: Array$<FXA>, b: number): _.Result<FXA, undefined>;
