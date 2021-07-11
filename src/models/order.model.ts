/**
 * 彩票订单记录
 */

import { Types } from "mongoose";
import mongoose from "mongoose";
import { formatTime } from "../utils";

export type OrderDocument = mongoose.Document & {
  orderPrice: string;
  userId: Types.ObjectId;
};

const OrderSchema = new mongoose.Schema<OrderDocument>(
  {
    /**
     * 订单金额
     */
    orderPrice: Number,
    userId: {
      type: Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret, options) {
        ret.orderId = ret._id;
        delete ret._id;
        delete ret.__v;
        ret.createdAt && (ret.createdAt = formatTime(ret.createdAt));
        ret.updatedAt && (ret.updatedAt = formatTime(ret.updatedAt));
        return ret;
      },
    },
  }
);

export const Order = mongoose.model<OrderDocument>("Order", OrderSchema);
