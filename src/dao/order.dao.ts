import { ObjectId } from "mongodb";
import { Order, OrderDocument } from "../models/order.model";

interface OrderFields {
  orderPrice: number;
  userId: string;
}

interface DBI<T> {
  addOrder(orderInfo: any): Promise<OrderDocument>;
  getOrderList(userId: string, pageNum: number, pageSize: number): any;
  getOrderById(orderId: string): any;
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
          userId: new ObjectId(userId),
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
      _id: new ObjectId(orderId),
    });
  }
})();
