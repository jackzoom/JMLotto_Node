import { Types } from "mongoose";
import { Order, OrderDocument } from "../models/order.model";

interface OrderFields {
    orderPrice: number
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
    getOrderList(userId: string, pageNum: number = 1, pageSize: number = 20): any {
        let limitVal = pageSize,
            skipVal = pageNum > 1 ? limitVal * (pageNum - 1) : 0;
        console.log({
            userId
        })
        return Order.aggregate([{
            $match: {
                userId
            }
        },
        {
            $lookup: {
                from: "ticket",
                localField: "_id",
                foreignField: "ticketId",
                as: "ticketList"
            }
        }
        ]).limit(limitVal).skip(skipVal)
        // return Order.find({}).limit(Number(limitVal)).skip(Number(skipVal));
    }
    getOrderById(orderId: string): any {
        return Order.findOne({
            _id: orderId,
        });
    }
})();
