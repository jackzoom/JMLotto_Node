/**
 * Api Client Token White List
 */
export const ApiClientWhiteList = [
  ...["/user/weappLogin", "/user/accountLogin"],//小程序登录
  ...['/period', '/period/last', '/period/detail'],//小程序开奖周期
];

/**
 * Api Admin Token White List
 */
export const ApiAdminWhiteList = [
  ...["/auth/login", "/user/insertTestUser"],//管理员登录
  ...["/wx/checkPushMsg"],//微信推送
];

/**
 * API Header Token Attribute
 */
export const ApiHeaderKey = `token`;

/**
 * Api JWT Secret
 */
export const ApiJWTSecretKey = `JM_LOTTO`;

/**
 * Api HTTP Code
 */
export const ApiHttpCode = {
  /**
   * 请求成功
   * @summary 通用响应errorCode
   * @default 0000
   */
  RequestSuccess: `0000`,
  /**
   * 请求失败
   * @summary 通用响应errorCode
   * @default `0001`
   */
  RequestFail: `0001`,
  /**
   * 未授权的请求
   * @summary 响应状态码
   * @default 401
   */
  Unauthorized: 401,
  /**
   * 授权令牌失效
   * @summary 响应状态码
   * @default 403
   */
  AuthFail: 403,
};

/**
 * Api Applet AppID
 */
export const ApiWxAppletAppID = `wx1c488632ee2510b8`;

/**
 * Api Applet Secret
 */
export const ApiWxAppletSecret = `9d5adba60745a48e86d584de3934f57e`;

/**
 * Wechat Message Serivce Token
 */
export const WxMsgToken = `JMLOTTO_WX_TOKEN`;

/**
 * 消息推送 消息加密密钥
 */
export const WxMsgEncodingAESKey = `NinsClvadby37orCvPjl2mT2z930Og9vQjMFJWBiQ15`;
