/**
 * Api Token White List
 */
export const ApiWhiteList = ["/client/user/weappLogin", "/admin/auth/login"];

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
   * 未授权的请求
   */
  Unauthorized: 401,
  /**
   * 授权令牌失效
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
