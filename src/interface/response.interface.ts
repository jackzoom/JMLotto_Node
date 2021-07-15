declare namespace HttpResponse {
  /**
   * Response Basic Handle
   */
  interface Success {
    errorCode: string | number;
    errorMsg: string;
    data?: any;
  }

  /**
   * Response Server Exception
   */
  interface Exception {
    message: string;
    code?: string | number;
    stack?: string;
  }

  /**
   * Response Pagin
   */
  interface Paging {
    content: Array<Object>;
    total: number;
    pageNum: number;
    pageSize: number;
  }
}
