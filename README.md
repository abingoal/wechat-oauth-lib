# wechat-oauth-lib

> 根据[官方文档](https://open.weixin.qq.com/cgi-bin/showdocument?action=dir_list&t=resource/res_list&verify=1&id=open1419317853&token=&lang=zh_CN)，使用 TypeScript 编写的微信授权后接口调用类库

## 使用方法

1.  首先引入该类库

> 需要的依赖`request-promise`

```typescript
import WechatOauth from "../libs/oauth/wechat-oauth";
```

2.  调用

```typescript
const code = req.body.code || "";
if (!code) {
  res.json(msgCode.parmsError);
}
const token = await oauth.getAccessToken(code);
let accesstoken: string = "";
let openid: string = "";
// 如果没有错误信息
if (!token.errcode) {
  openid = token.openid; // 获取openid
  accesstoken = token.access_token; // 获取accesstoken
  // 判断如果accesstoken过期，则续期
  if (token.expires_in === 0) {
    const refresh = await oauth.refreshToken(accesstoken);
    if (!refresh.errcode) {
      accesstoken = refresh.access_token;
      openid = refresh.openid;
    } else {
      res.json({ code: refresh.errcode, msg: token.errmsg });
    }
  }
  // 验证access_token是否有效
  const checktoken = await oauth.checkToken(openid, accesstoken);
  // 验证有效
  if (checktoken.errcode === 0) {
    // 获取用户信息
    const userinfo = await oauth.userInfo(openid, accesstoken);
    if (!userinfo.errcode) {
      res.json({ code: userinfo.errcode, msg: userinfo.errmsg });
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
      .then(data => tools.handleResult(data))
      .catch(err => next(err));
  } else {
    res.json(checktoken);
  }
} else {
  res.json({ code: token.errcode, msg: token.errmsg });
}
```

3.  优化

调用微信登录授权之前，可以先查询数据库中是否存在该 openid 的用户，如果有则直接返回用户信息，而不用频繁调用授权接口

4.  其他

详细的返回参数请参阅官方文档。由于使用 ts 编写，返回结果都有智能提示，请根据需要使用。

例:

![例子](/assets/img/example1.gif)
