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
