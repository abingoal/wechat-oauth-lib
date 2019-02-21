/**
 * 成功结果结构
 */
interface ISuccessResult {
    access_token: string;
    expires_in: number;
    refresh_token: string;
    openid: string;
    scope: string;
}
/**
 * 错误结果结果
 *
 * @export
 * @interface IErrorResult
 */
interface IErrorResult {
    errcode: number;
    errmsg: string;
}
/**
 * 用户信息结构
 *
 * @export
 * @interface IUserInfo
 */
interface IUserInfo {
    openid: string;
    nickname: string;
    sex: number;
    province: string;
    city: string;
    country: string;
    headimgurl: string;
    privilege: string[];
    unionid: string;
}
/**
 * 微信授权验证
 *
 * @class WechatOauth
 */
declare class WechatOauth {
    private baseUrl;
    private appid;
    private secret;
    /**
     * 实例化微信授权验证
     * @param {string} appid 应用唯一标识，在微信开放平台提交应用审核通过后获得
     * @param {string} secret 应用密钥AppSecret，在微信开放平台提交应用审核通过后获得
     * @memberof WechatOauth
     */
    constructor(appid: string, secret: string);
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
    getAccessToken(code: string): Promise<ISuccessResult & IErrorResult>;
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
    refreshToken(refreshToken: string, grantType?: string): Promise<ISuccessResult & IErrorResult>;
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
    checkToken(openid: string, accessToken: string): Promise<IErrorResult>;
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
    userInfo(openid: string, accessToken: string, lang?: string): Promise<IUserInfo & IErrorResult>;
}
export default WechatOauth;
