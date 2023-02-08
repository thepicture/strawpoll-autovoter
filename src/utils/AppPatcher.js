class AppPatcher {
  patch(content) {
    return this._removeFingerprint(content);
  }

  _removeFingerprint(content) {
    return content
      .replace(/score\:t/, "score:1")
      .replace(/confidence:Zo\(e\)/, "confidence:1")
      .replace(
        "return void 0===t&&(t=Xo(this.components)),t",
        "return Math.random().toString(36).slice(2)"
      );
  }
}

module.exports = {
  AppPatcher,
};
