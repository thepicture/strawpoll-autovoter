class ArgTypes {
  static POLL_ID = ["--poll", "-p"];
  static OPTION_ID = ["--option", "-o"];
  static HEADLESS = ["--headless", "-h"];
  static ATTEMPTS = ["--attempts", "-a"];
  static IGNORE_PROXY = ["--ignore-proxy", "-i"];
}

class Args {
  static has(argType) {
    if (argType.some((t) => typeof process.env[t] !== "undefined")) {
      return true;
    }
  }

  static get(argType, defaultValue) {
    const index = process.argv.findIndex((value) => argType.includes(value));
    const value =
      process.argv[
        process.argv.findIndex((value) => argType.includes(value)) + 1
      ];

    if (Args._isEntryValid(value, index)) {
      return Args._cast(value);
    }

    if (typeof defaultValue === "function") {
      return defaultValue(argType);
    } else {
      return defaultValue;
    }
  }

  static _isEntryValid(value, index) {
    return typeof value !== "undefined" && index !== -1;
  }

  static _cast(value) {
    if (value === "true") {
      return true;
    } else if (value === "false") {
      return false;
    } else {
      return value;
    }
  }
}

module.exports = {
  Args,
  ArgTypes,
};
