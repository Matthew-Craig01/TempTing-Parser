import type * as $dynamic from "../../../gleam_stdlib/gleam/dynamic.d.mts";
import type * as _ from "../../gleam.d.mts";
import type * as $array from "../../gleam/javascript/array.d.mts";

export type Promise$<FYS> = any;

export function new$<FYT>(a: (x0: (x0: FYT) => undefined) => undefined): Promise$<
  FYT
>;

export function resolve<FYV>(a: FYV): Promise$<FYV>;

export function rescue<FYX>(a: Promise$<FYX>, b: (x0: $dynamic.Dynamic$) => FYX): Promise$<
  FYX
>;

export function await$<FZA, FZC>(
  a: Promise$<FZA>,
  b: (x0: FZA) => Promise$<FZC>
): Promise$<FZC>;

export function map<FZF, FZH>(a: Promise$<FZF>, b: (x0: FZF) => FZH): Promise$<
  FZH
>;

export function tap<FZJ>(promise: Promise$<FZJ>, callback: (x0: FZJ) => any): Promise$<
  FZJ
>;

export function map_try<FZN, FZO, FZS>(
  promise: Promise$<_.Result<FZN, FZO>>,
  callback: (x0: FZN) => _.Result<FZS, FZO>
): Promise$<_.Result<FZS, FZO>>;

export function try_await<FZY, FZZ, GAD>(
  promise: Promise$<_.Result<FZY, FZZ>>,
  callback: (x0: FZY) => Promise$<_.Result<GAD, FZZ>>
): Promise$<_.Result<GAD, FZZ>>;

export function await2<GAK, GAM>(a: Promise$<GAK>, b: Promise$<GAM>): Promise$<
  [GAK, GAM]
>;

export function await3<GAP, GAR, GAT>(
  a: Promise$<GAP>,
  b: Promise$<GAR>,
  c: Promise$<GAT>
): Promise$<[GAP, GAR, GAT]>;

export function await4<GAW, GAY, GBA, GBC>(
  a: Promise$<GAW>,
  b: Promise$<GAY>,
  c: Promise$<GBA>,
  d: Promise$<GBC>
): Promise$<[GAW, GAY, GBA, GBC]>;

export function await5<GBF, GBH, GBJ, GBL, GBN>(
  a: Promise$<GBF>,
  b: Promise$<GBH>,
  c: Promise$<GBJ>,
  d: Promise$<GBL>,
  e: Promise$<GBN>
): Promise$<[GBF, GBH, GBJ, GBL, GBN]>;

export function await6<GBQ, GBS, GBU, GBW, GBY, GCA>(
  a: Promise$<GBQ>,
  b: Promise$<GBS>,
  c: Promise$<GBU>,
  d: Promise$<GBW>,
  e: Promise$<GBY>,
  f: Promise$<GCA>
): Promise$<[GBQ, GBS, GBU, GBW, GBY, GCA]>;

export function await_array<GCD>(a: $array.Array$<Promise$<GCD>>): Promise$<
  $array.Array$<GCD>
>;

export function await_list<GCI>(xs: _.List<Promise$<GCI>>): Promise$<
  _.List<GCI>
>;

export function race2<GCS>(a: Promise$<GCS>, b: Promise$<GCS>): Promise$<GCS>;

export function race3<GCW>(a: Promise$<GCW>, b: Promise$<GCW>, c: Promise$<GCW>): Promise$<
  GCW
>;

export function race4<GDB>(
  a: Promise$<GDB>,
  b: Promise$<GDB>,
  c: Promise$<GDB>,
  d: Promise$<GDB>
): Promise$<GDB>;

export function race5<GDH>(
  a: Promise$<GDH>,
  b: Promise$<GDH>,
  c: Promise$<GDH>,
  d: Promise$<GDH>,
  e: Promise$<GDH>
): Promise$<GDH>;

export function race6<GDO>(
  a: Promise$<GDO>,
  b: Promise$<GDO>,
  c: Promise$<GDO>,
  d: Promise$<GDO>,
  e: Promise$<GDO>,
  f: Promise$<GDO>
): Promise$<GDO>;

export function race_list<GDW>(a: _.List<Promise$<GDW>>): Promise$<GDW>;

export function race_array<GEA>(a: $array.Array$<Promise$<GEA>>): Promise$<GEA>;
