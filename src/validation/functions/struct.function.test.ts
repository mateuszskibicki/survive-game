import { Struct, StructError } from "superstruct";
import { struct } from "./struct.function";

describe("struct", () => {
  it("should be defined and a function", () => {
    expect(struct).toBeDefined();
    expect(typeof struct === "function").toBeDefined();
  });

  describe("truthy", () => {
    it("should validate data when valid", () => {
      const validation: Struct = struct({
        truthy: "truthy",
      });

      expect(() => validation({ truthy: true })).not.toThrow();
    });
    it("should throw the StructError", () => {
      const validation: Struct = struct({
        truthy: "truthy",
      });

      expect(() => validation({ truthy: false })).toThrow(StructError);
    });
  });

  describe("emptystring", () => {
    it("should empty string when valid", () => {
      const validation: Struct = struct({
        emptystring: "emptystring",
      });

      expect(() => validation({ emptystring: "" })).not.toThrow();
    });
    it("should throw the StructError", () => {
      const validation: Struct = struct({
        emptystring: "emptystring",
      });

      expect(() => validation({ emptystring: "123" })).toThrow(StructError);
    });
  });

  describe("isDefined", () => {
    it("should validate data when valid", () => {
      const validation: Struct = struct({
        isdefined: "isdefined",
      });

      expect(() => validation({ isdefined: "" })).not.toThrow();
    });

    it("should throw the StructError", () => {
      const validation: Struct = struct({
        isdefined: "isdefined",
      });

      expect(() => validation({})).toThrow(StructError);
    });
  });

  describe("nonemptystring", () => {
    it("should validate data when valid", () => {
      const validation: Struct = struct({
        nonemptystring: "nonemptystring",
      });
      expect(() => validation({ nonemptystring: "abc" })).not.toThrow();
    });
    it("should throw the StructError", () => {
      const validation: Struct = struct({
        nonemptystring: "nonemptystring",
      });
      expect(() => validation({ nonemptystring: "" })).toThrow();
    });
  });

  describe("iso8601", () => {
    it("should validate data when valid", () => {
      const validation: Struct = struct({
        iso8601: "iso8601",
      });
      expect(() =>
        validation({ iso8601: "2020-04-14T16:41:32.407Z" })
      ).not.toThrow();
    });
    it("should throw the StructError", () => {
      const validation: Struct = struct({
        iso8601: "iso8601",
      });
      expect(() => validation({ iso8601: "" })).toThrow();
    });
  });
});
