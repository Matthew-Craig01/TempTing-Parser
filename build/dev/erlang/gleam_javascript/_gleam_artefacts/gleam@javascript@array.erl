-module(gleam@javascript@array).
-compile([no_auto_import, nowarn_unused_vars, nowarn_unused_function, nowarn_nomatch]).

-export_type([array/1]).

-type array(FYX) :: any() | {gleam_phantom, FYX}.


