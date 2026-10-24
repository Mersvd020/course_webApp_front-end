const fs = require("node:fs");
const path = require("node:path");
const Module = require("node:module");
const ts = require("typescript");

// Transpile the actual app modules for Node's test runner without a second build.
// Explicit mocks isolate API responses; application logic is not duplicated here.
module.exports = function createLoader(mocks = {}) {
  const root = path.resolve(__dirname, "..");
  const cache = new Map();

  function load(filename) {
    const absolute = path.resolve(root, filename);
    if (cache.has(absolute)) return cache.get(absolute).exports;
    const source = fs.readFileSync(absolute, "utf8");
    const code = ts.transpileModule(source, {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2020,
        jsx: ts.JsxEmit.ReactJSX,
        esModuleInterop: true,
      },
      fileName: absolute,
    }).outputText;
    const compiledModule = { exports: {} };
    cache.set(absolute, compiledModule);
    const nativeRequire = Module.createRequire(absolute);
    function resolve(specifier) {
      if (specifier in mocks) return mocks[specifier];
      if (specifier.startsWith("@/") || specifier.startsWith(".")) {
        const base = specifier.startsWith("@/")
          ? path.join(root, specifier.slice(2))
          : path.resolve(path.dirname(absolute), specifier);
        const target = [base, `${base}.ts`, `${base}.tsx`].find(
          (file) => fs.existsSync(file) && fs.statSync(file).isFile(),
        );
        if (target) return load(target);
      }
      return nativeRequire(specifier);
    }
    new Function("require", "module", "exports", code)(
      resolve,
      compiledModule,
      compiledModule.exports,
    );
    return compiledModule.exports;
  }
  return load;
};
