# wechat-oauth-lib

> 根据[官方文档](https://open.weixin.qq.com/cgi-bin/showdocument?action=dir_list&t=resource/res_list&verify=1&id=open1419317853&token=&lang=zh_CN)，使用 TypeScript 编写的微信授权后接口调用类库

## 使用方法

1. 首先引入该类库

```typescript
import WechatOauth from "../libs/oauth/wechat-oauth";
```

1. 调用

```typescript
const { code = "" }: IReqBody = req.body;
if (!code) {
  // 此处请自行处理参数错误的返回
  res.json(msgCode.parmsError);
  return;
}
const token = await oauth.getAccessToken(code);
let accesstoken: string = "";
let openid: string = "";
// 如果有错误信息
// 此处自行处理获取token失败的问题
if (token.errcode) {
  res.json({ code: token.errcode, msg: token.errmsg });
  return;
}
openid = token.openid; // 获取openid
accesstoken = token.access_token; // 获取accesstoken
// 判断如果accesstoken过期，则续期
if (token.expires_in === 0) {
  const refresh = await oauth.refreshToken(accesstoken);
  if (refresh.errcode) {
    res.json({ code: refresh.errcode, msg: token.errmsg });
    return;
  }
  accesstoken = refresh.access_token;
  openid = refresh.openid;
}
// 验证access_token是否有效
const checktoken = await oauth.checkToken(openid, accesstoken);
// 验证有效
if (checktoken.errcode) {
  res.json({ code: checktoken.errcode, msg: checktoken.errmsg });
  return;
}
// 获取用户信息
const userinfo = await oauth.userInfo(openid, accesstoken);
if (userinfo.errcode) {
  res.json({ code: userinfo.errcode, msg: userinfo.errmsg });
  return;
}
await dbUsers
  .thirdPartLogin({
    nickname,
    avatar,
    sex,
    os,
    ip,
    deviceid,
    openid
  })
  .then(data => handleResult(data)) // 此处处理获取到的用户信息
  .catch(err => next(err));
```

3. 优化

调用微信登录授权之前，可以先查询数据库中是否存在该 openid 的用户，如果有则直接返回用户信息，而不用频繁调用授权接口

4. 其他

详细的返回参数请参阅官方文档。

图示:

![例子](/assets/img/example1.gif)
