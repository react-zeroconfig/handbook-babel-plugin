"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.source = void 0;
function source(module) {
    if ('module' in module && 'source' in module && 'filename' in module) {
        return module;
    }
    throw new Error(`Can't find the module. You have to install @handbook/babel-plugin`);
}
exports.source = source;
//# sourceMappingURL=index.js.map