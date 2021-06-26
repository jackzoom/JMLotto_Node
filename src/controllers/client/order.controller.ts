import { Request, Response } from "express"; // express 申明文件定义的类型
import Base from "../base.controller";
import OrderDao from "../../dao/order.dao";
import { JwtAuthResponse } from "../../interface/auth.interface";

export default new (class ClientOrder extends Base {
  constructor() {
    super();
    this.getOrderList = this.getOrderList.bind(this);
    this.getOrderDetail = this.getOrderDetail.bind(this);
  }

  /**
   * 获取订单列表 GetOrderList
   * @group ClientOrder
   * @route GET /client/order
   * @param req
   * @param res
   */
  async getOrderList(req: Request, res: JwtAuthResponse) {
    let { userId } = res.authUser;
    let pageNum = (req.query.pageNum || 1) as number;
    let pageSize = (req.query.pageSize || 20) as number;
    try {
      OrderDao.getOrderList(userId, pageNum, pageSize)
        .then((data: any) => {
          this.ResponseSuccess(
            res,
            data.map((item: any) => {
              item.orderId = item._id;
              delete item._id;
              item.ticketList = item.ticketList.map((titem: any) => {
                titem.ticketId = titem._id;
                delete titem._id;
                return titem;
              });
              return item;
            })
          );
        })
        .catch((err: any) => {
          this.ResponseError(res, err);
        });
    } catch (err) {
      this.ResponseError(res, err);
    }
  }

  /**
   * 获取订单详情 GetOrderDetail
   * @group ClientOrder
   * @route GET /client/order/detail
   * @param req
   * @param res
   */
  async getOrderDetail(req: Request, res: Response) {
    let { orderId } = req.query;
    OrderDao.getOrderById(orderId as string)
      .then((data: any) => {
        this.ResponseSuccess(res, data);
      })
      .catch((err: any) => {
        this.ResponseError(res, err);
      });
  }
})();
