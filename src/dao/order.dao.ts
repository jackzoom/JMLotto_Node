import { Types } from "mongoose";
import { Order, OrderDocument } from "../models/order.model";

interface OrderFields {
  orderPrice: number;
  periodId: string;
  userId: string;
}

interface DBI<T> {
  addOrder(orderInfo: any): Promise<OrderDocument>;
  getOrderList(userId: string, pageNum: number, pageSize: number): any;
  getOrderById(orderId: string): any;
  getOrderListByPeriodId(periodId: string): any
}

export default new (class OrderDao<T> implements DBI<T> {
  async addOrder(orderInfo: OrderFields): Promise<OrderDocument | any> {
    let orderModel = new Order({
      ...orderInfo,
    });
    return orderModel.save();
  }
  getOrderList(
    userId: string,
    pageNum: number = 1,
    pageSize: number = 20
  ): any {
    let limitVal = pageSize,
      skipVal = pageNum > 1 ? limitVal * (pageNum - 1) : 0;
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
            __v: 0
          },
        },
      },
    ])
      .limit(limitVal)
      .skip(skipVal);
    // return Order.find({}).limit(Number(limitVal)).skip(Number(skipVal));
  }
  getOrderById(orderId: string): any {
    return Order.findOne({
      _id: Types.ObjectId(orderId),
    });
  }
  /**
   * 根据开奖周期ID，获取最近投注的10个订单
   * @param periodId 
   * @returns 
   */
  getOrderListByPeriodId(periodId: string): any {
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
      }, {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "userInfo",
        }
      }, {
        $unwind: "$userInfo"
      },
      {
        $addFields: {
          nickName: "$userInfo.nickName",
          avatarUrl: "$userInfo.avatarUrl",
          userId: "$userInfo._id",
          orderPrice: "$userInfo.orderPrice",
          createTime: "$createdAt"
        }
      },
      {
        $project: {
          _id: 0,
          nickName: 1,
          avatarUrl: 1,
          userId: 1,
          createTime: 1,
          totalTicket: { $size: "$ticketList" }, //累计投注订单数  
        },
      },
    ])
      .limit(10)
      .skip(0)
      .sort({
        createTime: -1
      })
  }
})();
