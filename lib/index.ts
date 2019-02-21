import axios, { AxiosRequestConfig } from "axios";
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
  private baseUrl: string = "https://api.weixin.qq.com/sns";
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
  async getAccessToken(code: string) {
    const options: AxiosRequestConfig = {
      method: "get",
      baseURL: this.baseUrl,
      params: {
        appid: this.appid,
        secret: this.secret,
        code,
        grant_type: "authorization_code"
      }
    };
    return await axios.get<ISuccessResult & IErrorResult>("/oauth2/access_token", options).then(res => res.data);
  }
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
  async refreshToken(refreshToken: string, grantType: string = "refresh_token") {
    const options: AxiosRequestConfig = {
      method: "get",
      baseURL: this.baseUrl,
      params: {
        appid: this.appid,
        grant_type: "refresh_token",
        refresh_token: refreshToken
      }
    };
    return await axios.get<ISuccessResult & IErrorResult>("/oauth2/refresh_token", options).then(res => res.data);
  }
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
  async checkToken(openid: string, accessToken: string) {
    const options: AxiosRequestConfig = {
      baseURL: this.baseUrl,
      params: {
        openid,
        access_token: accessToken
      }
    };
    return await axios.get<IErrorResult>("/auth", options).then(res => res.data);
  }
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
  async userInfo(openid: string, accessToken: string, lang?: string) {
    const options: AxiosRequestConfig = {
      baseURL: this.baseUrl,
      params: {
        openid,
        access_token: accessToken
      }
    };
    return await axios.get<IUserInfo & IErrorResult>("/userinfo", options).then(res => res.data);
  }
}
export default WechatOauth;
