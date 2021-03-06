import { Types } from "mongoose";
import { Order, OrderDocument } from "../models/order.model";

interface OrderFields {
  orderPrice: number;
  periodId: string;
  userId: string;
  ticketStatus: number;
}

interface DBI<T> {
  addOrder(orderInfo: any): Promise<OrderDocument>;
  getOrderList(userId: string, pageNum: number, pageSize: number): any;
  getOrderById(orderId: string): any;
  getOrderListByPeriodId(periodId: string): any;
  getOrderTotal(match: any): any;
  updateOrderStatus(orderId: string, ticketStatus: number): any;
}

export default new (class OrderDao<T> implements DBI<T> {
  async addOrder(orderInfo: OrderFields): Promise<OrderDocument | any> {
    let orderModel = new Order({
      ...orderInfo,
    });
    return orderModel.save();
  }
  /**
   * 获取订单列表
   * @param userId
   * @param pageNum
   * @param pageSize
   */
  getOrderList(
    userId: string,
    pageNum: number = 1,
    pageSize: number = 20
  ): any {
    let limitVal = +pageSize,
      skipVal = pageNum > 1 ? limitVal * (+pageNum - 1) : 0;
    return Order.aggregate([
      {
        $match: {
          userId: Types.ObjectId(userId),
        },
      },
      {
        $lookup: {
          from: "tickets",
          localField: "_id",
          foreignField: "orderId",
          as: "ticketList",
        },
      },
      {
        $project: {
          __v: 0,
          ticketList: {
            __v: 0,
          },
        },
      },
    ])
      .sort({
        createdAt: -1,
      })
      .skip(+skipVal)
      .limit(+limitVal);
    // return Order.find({}).skip(Number(skipVal)).limit(Number(limitVal));
  }
  getOrderById(orderId: string): any {
    return Order.findOne({
      _id: Types.ObjectId(orderId),
    });
  }
  /**
   * 根据开奖周期ID，获取最近投注的10个订单
   * @param periodId
   * @param pageNum
   * @param pageSize
   */
  getOrderListByPeriodId(
    periodId: string,
    pageNum: number = 1,
    pageSize: number = 20
  ): any {
    let limitVal = pageSize,
      skipVal = pageNum > 1 ? limitVal * (pageNum - 1) : 0;
    return Order.aggregate([
      {
        $match: {
          periodId: Types.ObjectId(periodId),
        },
      },
      {
        $lookup: {
          from: "tickets",
          localField: "_id",
          foreignField: "orderId",
          as: "ticketList",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "userInfo",
        },
      },
      {
        $unwind: "$userInfo",
      },
      {
        $addFields: {
          nickName: "$userInfo.nickName",
          avatarUrl: "$userInfo.avatarUrl",
          userId: "$userInfo._id",
          orderPrice: "$userInfo.orderPrice",
          createTime: "$createdAt",
        },
      },
      {
        $project: {
          _id: 0,
          nickName: 1,
          avatarUrl: 1,
          userId: 1,
          createTime: 1,
          totalTicket: {
            $size: "$ticketList",
          }, //累计投注订单数
        },
      },
      {
        $sort: {
          createTime: -1,
        },
      },
      {
        $skip: +skipVal,
      },
      {
        $limit: +limitVal,
      },
    ]);
  }

  /**
   * 统计订单数
   * @param match
   */
  getOrderTotal(match: any) {
    return Order.find(match).countDocuments();
  }

  /**
   * 更新订单状态
   * @param orderId
   * @param ticketStatus
   */
  updateOrderStatus(orderId: string, ticketStatus: number) {
    return Order.updateOne(
      {
        _id: Types.ObjectId(orderId),
      },
      {
        ticketStatus: +ticketStatus,
      }
    );
  }
})();
