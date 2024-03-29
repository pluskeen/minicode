/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise, SuppressedError, Symbol */


var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

function __spreadArray(to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
}

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

var Options = /** @class */ (function () {
    function Options() {
    }
    return Options;
}());
var PollFetch = /** @class */ (function () {
    function PollFetch(fn, options) {
        this.defaultOptions = new Options();
        this.loop = true;
        this.timeId = 0;
        if (typeof fn !== 'function') {
            throw new Error("PollFetch: first parameter must be the Function");
        }
        if (!!options && Object.prototype.toString.call(options) === '[object Object]') {
            this.options = __assign(__assign({}, this.defaultOptions), options);
        }
        else {
            this.options = this.defaultOptions;
        }
        this.fn = this.generateNewFn(fn, this.options);
    }
    PollFetch.prototype.generateNewFn = function (fn, options) {
        var params = options.params;
        // 存在 params
        if (!!params) {
            if (Array.isArray(params)) {
                // @ts-ignore
                return fn.bind.apply(fn, __spreadArray([this.options.ctx], this.options.params, false));
            }
            else {
                throw new Error('PollFetch: params type should be the Array');
            }
        }
        else {
            return fn;
        }
    };
    PollFetch.prototype.timeoutPromise = function () {
        var _this = this;
        return new Promise(function (resolve) {
            _this.timeId = setTimeout(resolve, _this.options.delayTime * 1000);
        });
    };
    PollFetch.prototype.syncPromise = function () {
        return Promise.resolve(this.fn());
    };
    PollFetch.prototype.exec = function () {
        return __awaiter(this, void 0, void 0, function () {
            var err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.options.immediately) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.syncPromise()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        if (!this.loop) return [3 /*break*/, 9];
                        _a.label = 3;
                    case 3:
                        _a.trys.push([3, 6, , 8]);
                        return [4 /*yield*/, this.timeoutPromise()];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, this.syncPromise()];
                    case 5:
                        _a.sent();
                        return [3 /*break*/, 8];
                    case 6:
                        err_1 = _a.sent();
                        this.loop = false;
                        return [4 /*yield*/, Promise.reject(err_1)];
                    case 7:
                        _a.sent();
                        return [3 /*break*/, 8];
                    case 8: return [3 /*break*/, 2];
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    PollFetch.prototype.destroy = function () {
        clearTimeout(this.timeId);
        this.loop = false;
        this.fn = function () { };
        this.options = this.defaultOptions;
    };
    return PollFetch;
}());

export { PollFetch };
//# sourceMappingURL=index.esm.js.map
