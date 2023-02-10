const { Args, ArgTypes } = require("./Args");

describe("Args", () => {
  const THROW_ERROR_FUNCTION = () => {
    throw new Error();
  };

  beforeEach(() => {
    process.argv = [
      "/usr/local/bin/node",
      "/home/ubuntu/folder/node_modules/.bin/jest",
      "-h",
      "true",
    ];
  });

  it("when argument is missing then throws", () => {
    const foo = () => Args.get(ArgTypes.POLL_ID, THROW_ERROR_FUNCTION);

    expect(foo).toThrow();
  });

  it("when argument is presented then returns its value", () => {
    const expected = true;

    const actual = Args.get(ArgTypes.HEADLESS, THROW_ERROR_FUNCTION);

    expect(actual).toBe(expected);
  });

  it("when argument is not presented with default value then returns the latter", () => {
    const expected = Number.EPSILON;

    const actual = Args.get(ArgTypes.POLL_ID, Number.EPSILON);

    expect(actual).toBe(expected);
  });

  it("when argument is not presented with no default value then returns undefined", () => {
    const expected = void 0;

    const actual = Args.get(ArgTypes.POLL_ID);

    expect(actual).toBe(expected);
  });
});
