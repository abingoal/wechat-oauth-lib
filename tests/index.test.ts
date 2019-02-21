import WechatOauth from "../lib/index";
test("test name", () => {
  const oauth = new WechatOauth("appid", "secret");
  expect(oauth).not.toBeNull();
});
