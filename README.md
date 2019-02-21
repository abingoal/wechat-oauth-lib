# wechat-oauth-lib

![Dependency](https://img.shields.io/librariesio/github/abingoal/wechat-oauth-lib.svg)
![Downloads](https://img.shields.io/npm/dm/wechat-oauth-lib.svg)
![Version](https://img.shields.io/npm/v/wechat-oauth-lib.svg)

> 根据[官方文档](https://open.weixin.qq.com/cgi-bin/showdocument?action=dir_list&t=resource/res_list&verify=1&id=open1419317853&token=&lang=zh_CN)，使用 TypeScript 编写的微信授权后接口调用类库

## 使用方法

### 首先引入该类库

```typescript
import WechatOauth from "wechat-oauth-lib";
```

### 初始化类库

```typescript
const oauth = new WechatOauth("appid", "secret");
```

### 调用

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
// 验证无效
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
const loginResult = await dbUsers.thirdPartLogin({
  nickname,
  avatar,
  sex,
  os,
  ip,
  deviceid,
  openid
});
DoSomethingWhithResult(loginResult);
```

### 优化

调用微信登录授权之前，可以先查询数据库中是否存在该 openid 的用户，如果有则直接返回用户信息，而不用频繁调用授权接口

### 其他

详细的返回参数请参阅[官方文档](https://open.weixin.qq.com/cgi-bin/showdocument?action=dir_list&t=resource/res_list&verify=1&id=open1419316518&token=&lang=zh_CN)。

### 图示

![例子](/assets/img/example1.gif)
