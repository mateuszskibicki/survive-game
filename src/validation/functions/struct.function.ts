import { Superstruct, superstruct } from "superstruct";
import { isNonEmptyString } from "./is-non-empty-string.function";
import { isDefined } from "./is-defined.function";
import { isIso8601 } from "./is-iso-8601.function";
/**
 * Creata a custom struct factory with
 * additional, custom validation
 * @var {Superstruct}
 */
export const struct: Superstruct = superstruct({
  types: {
    truthy: (val): boolean => !!val,
    emptystring: (val): boolean => typeof val === "string" && val.length === 0,
    isdefined: (val): boolean => isDefined(val),
    nonemptystring: (val): boolean => isNonEmptyString(val),
    iso8601: (val): boolean => isIso8601(val),
  },
});
