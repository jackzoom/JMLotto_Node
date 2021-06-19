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
    totalElement: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
  }
}
