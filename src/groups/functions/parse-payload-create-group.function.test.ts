import { StructError } from "superstruct";
import { parsePayloadCreateGroup } from "./parse-payload-create-group.function";

describe("parsePayloadCreateGroup", () => {
  it("throws a struct error if the request is invalid", () => {
    const badValues = [{ name: 123 }, { name: "" }];

    badValues.forEach((value: any) => {
      expect(() => parsePayloadCreateGroup(value)).toThrow(StructError);
    });
  });

  it("parses the request params", () => {
    expect(
      parsePayloadCreateGroup({
        name: "some name",
      })
    ).toEqual({
      name: "some name",
    });
  });
});
