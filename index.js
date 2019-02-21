"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
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
};
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = require("axios");
/**
 * 微信授权验证
 *
 * @class WechatOauth
 */
var WechatOauth = /** @class */ (function () {
    /**
     * 实例化微信授权验证
     * @param {string} appid 应用唯一标识，在微信开放平台提交应用审核通过后获得
     * @param {string} secret 应用密钥AppSecret，在微信开放平台提交应用审核通过后获得
     * @memberof WechatOauth
     */
    function WechatOauth(appid, secret) {
        this.baseUrl = "https://api.weixin.qq.com/sns";
        this.appid = appid;
        this.secret = secret;
    }
    /**
     * 通过code换取access_token
     *
     * 调用频率限制 `5万/分钟`
     * - 返回参数, 正确时
      ``` json
      {
         "access_token":"ACCESS_TOKEN",
         "expires_in":7200,
         "refresh_token":"REFRESH_TOKEN",
         "openid":"OPENID",
         "scope":"SCOPE"
      }
      ```
      - 返回参数，错误时
      ``` json
      {
         "errcode":40029,
         "errmsg":"invalid code"
      }
      ```
     * @param {string} code 客户端授权后返回的code
     * @returns 返回access_token
     * @memberof WechatOauth
     */
    WechatOauth.prototype.getAccessToken = function (code) {
        return __awaiter(this, void 0, void 0, function () {
            var options;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        options = {
                            method: "get",
                            baseURL: this.baseUrl,
                            params: {
                                appid: this.appid,
                                secret: this.secret,
                                code: code,
                                grant_type: "authorization_code"
                            }
                        };
                        return [4 /*yield*/, axios_1.default.get("/oauth2/access_token", options).then(function (res) { return res.data; })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * 刷新access_token
     *
     * 调用频率限制 `10万/分钟`
     *
     * access_token是调用授权关系接口的调用凭证，由于access_token有效期（目前为2个小时）较短，当access_token超时后，可以使用refresh_token进行刷新，access_token刷新结果有两种：
     * 1. 若access_token已超时，那么进行refresh_token会获取一个新的access_token，新的超时时间；
     * 2. 若access_token未超时，那么进行refresh_token不会改变access_token，但超时时间会刷新，相当于续期access_token。
     *
     * refresh_token拥有较长的有效期（30天）且无法续期，当refresh_token失效的后，需要用户重新授权后才可以继续获取用户头像昵称。
     * - 返回参数, 正确时
      ``` json
      {
         "access_token":"ACCESS_TOKEN",
         "expires_in":7200,
         "refresh_token":"REFRESH_TOKEN",
         "openid":"OPENID",
         "scope":"SCOPE"
      }
      ```
      - 返回参数，错误时
      ``` json
      {
         "errcode":40029,
         "errmsg":"invalid code"
      }
      ```
     * @param {string} appid 应用唯一标识
     * @param {string} refreshToken 通过access_token获取到的refresh_token参数
     * @memberof WechatOauth
     */
    WechatOauth.prototype.refreshToken = function (refreshToken, grantType) {
        if (grantType === void 0) { grantType = "refresh_token"; }
        return __awaiter(this, void 0, void 0, function () {
            var options;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        options = {
                            method: "get",
                            baseURL: this.baseUrl,
                            params: {
                                appid: this.appid,
                                grant_type: "refresh_token",
                                refresh_token: refreshToken
                            }
                        };
                        return [4 /*yield*/, axios_1.default.get("/oauth2/refresh_token", options).then(function (res) { return res.data; })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * 检验授权凭证（access_token）是否有效
     *
     * @param openid 普通用户的标识，对当前开发者帐号唯一
     * @param accessToken 调用凭证
     *
      - 正确的返回结果示例
      ``` json
      { "errcode": 0, "errmsg": "ok" }
      ```
      - 错误的返回结果示例
      ``` json
      { "errcode": 40003, "errmsg": "invalid openid" }
      ```
     */
    WechatOauth.prototype.checkToken = function (openid, accessToken) {
        return __awaiter(this, void 0, void 0, function () {
            var options;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        options = {
                            baseURL: this.baseUrl,
                            params: {
                                openid: openid,
                                access_token: accessToken
                            }
                        };
                        return [4 /*yield*/, axios_1.default.get("/auth", options).then(function (res) { return res.data; })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * 获取用户信息（UnionID机制）
     *
     * 开发者最好保存unionID信息，以便以后在不同应用之间进行用户信息互通
     *
     * 调用频率限制 `5万/分钟`
     * @param {string} openid 普通用户的标识，对当前开发者帐号唯一
     * @param {string} accessToken 调用凭证
     * @param {string} lang 国家地区语言版本，zh_CN 简体，zh_TW 繁体，en 英语，默认为zh-CN
     * @memberof WechatOauth
     */
    WechatOauth.prototype.userInfo = function (openid, accessToken, lang) {
        return __awaiter(this, void 0, void 0, function () {
            var options;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        options = {
                            baseURL: this.baseUrl,
                            params: {
                                openid: openid,
                                access_token: accessToken
                            }
                        };
                        return [4 /*yield*/, axios_1.default.get("/userinfo", options).then(function (res) { return res.data; })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    return WechatOauth;
}());
exports.default = WechatOauth;
