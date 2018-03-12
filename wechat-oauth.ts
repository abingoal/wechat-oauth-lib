import * as rp from "request-promise";
/**
 * 成功结果结构
 */
interface ISuccessResult {
  access_token: string; // 接口调用凭证
  expires_in: number; // access_token接口调用凭证超时时间，单位（秒）
  refresh_token: string; // 用户刷新access_token
  openid: string; // 授权用户唯一标识
  scope: string; // 用户授权的作用域，使用逗号（,）分隔
}
/**
 * 错误结果结果
 *
 * @export
 * @interface IErrorResult
 */
interface IErrorResult {
  errcode: number; // 错误码
  errmsg: string; // 错误信息
}
/**
 * 用户信息结构
 *
 * @export
 * @interface IUserInfo
 */
interface IUserInfo {
  openid: string; // 普通用户的标识，对当前开发者帐号唯一
  nickname: string; // 普通用户昵称
  sex: number; // 普通用户性别，1为男性，2为女性
  province: string; // 普通用户个人资料填写的省份
  city: string; // 普通用户个人资料填写的城市
  country: string; // 国家，如中国为CN
  headimgurl: string; // 用户头像，最后一个数值代表正方形头像大小（有0、46、64、96、132数值可选，0代表640*640正方形头像），用户没有头像时该项为空
  privilege: string[]; // 用户特权信息，json数组，如微信沃卡用户为（chinaunicom）
  unionid: string; // 用户统一标识。针对一个微信开放平台帐号下的应用，同一用户的unionid是唯一的。
}
/**
 * 微信授权验证
 *
 * @class WechatOauth
 */
class WechatOauth {
  private urlPrefix: string = "https://api.weixin.qq.com/sns";
  private appid: string;
  private secret: string;
  /**
   * 实例化微信授权验证
   * @param {string} appid 应用唯一标识，在微信开放平台提交应用审核通过后获得
   * @param {string} secret 应用密钥AppSecret，在微信开放平台提交应用审核通过后获得
   * @memberof WechatOauth
   */
  constructor(appid: string, secret: string) {
    this.appid = appid;
    this.secret = secret;
  }

  /**
   * 通过code换取access_token
   *
   * 调用频率限制 `5万/分钟`
   *
   * @param {string} code 客户端授权后返回的code
   * @returns 返回access_token
   * @memberof WechatOauth
   *
   * - 返回参数, 正确时
   * ``` json
   * {
   *    "access_token":"ACCESS_TOKEN",
   *    "expires_in":7200,
   *    "refresh_token":"REFRESH_TOKEN",
   *    "openid":"OPENID",
   *    "scope":"SCOPE"
   * }
   * ```
   * - 返回参数，错误时
   * ``` json
   * {
   *    "errcode":40029,
   *    "errmsg":"invalid code"
   * }
   * ```
   */
  public async getAccessToken(code: string) {
    const options: rp.Options = {
      uri: `${this.urlPrefix}/oauth2/access_token`,
      qs: {
        appid: this.appid,
        secret: this.secret,
        code,
        grant_type: "authorization_code"
      }
    };
    return await rp(options).then((data: ISuccessResult & IErrorResult) => data);
  }
  /**
   * 刷新access_token
   *
   * 调用频率限制 `10万/分钟`
   *
   * @param {string} appid 应用唯一标识
   * @param {string} refreshToken 待刷新token
   * @memberof WechatOauth
   */
  public async refreshToken<T>(refreshToken: string, grantType: string = "refresh_token") {
    const options: rp.Options = {
      uri: `${this.urlPrefix}/oauth2/refresh_token`,
      qs: {
        appid: this.appid,
        grant_type: "refresh_token",
        refresh_token: refreshToken
      }
    };
    return await rp(options).then((data: ISuccessResult & IErrorResult) => data);
  }
  /**
   * 检验授权凭证（access_token）是否有效
   *
   * @param openid 普通用户的标识，对当前开发者帐号唯一
   * @param accessToken 调用凭证
   *
   * - 正确的返回结果
   * ``` json
   * {
   *    "errcode": 0,
   *    "errmsg": "ok"
   * }
   * ```
   */
  public async checkToken<T>(openid: string, accessToken: string) {
    const options: rp.Options = {
      url: `${this.urlPrefix}/auth`,
      qs: {
        openid,
        access_token: accessToken
      }
    };
    return await rp(options).then((data: IErrorResult) => data);
  }
  /**
   * 获取用户信息
   *
   * 开发者最好保存unionID信息，以便以后在不同应用之间进行用户信息互通
   *
   * 调用频率限制 `5万/分钟`
   * @param {string} openid 普通用户的标识，对当前开发者帐号唯一
   * @param {string} accessToken 调用凭证
   * @memberof WechatOauth
   */
  public async userInfo<T>(openid: string, accessToken: string) {
    const options: rp.Options = {
      uri: `${this.urlPrefix}/userinfo`,
      qs: {
        openid,
        access_token: accessToken
      }
    };
    return await rp(options).then((data: IUserInfo & IErrorResult) => data);
  }
}
export default WechatOauth;
