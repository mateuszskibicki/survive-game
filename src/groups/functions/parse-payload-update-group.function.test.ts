import { StructError } from "superstruct";
import { parsePayloadUpdateGroup } from "./parse-payload-update-group.function";

describe("parsePayloadUpdateGroup", () => {
  it("throws a struct error if the request is invalid", () => {
    const badValues = ["", false, 123];

    badValues.forEach((value: any) => {
      expect(() =>
        parsePayloadUpdateGroup({
          name: value,
        })
      ).toThrow(StructError);
    });
  });

  it("parses the request params", () => {
    expect(
      parsePayloadUpdateGroup({
        name: "some name",
      })
    ).toEqual({
      name: "some name",
    });
  });
});
