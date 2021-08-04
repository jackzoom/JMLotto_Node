/**
 * 彩票号码表
 */
import { Types } from "mongoose";
import mongoose from "mongoose";
import { formatTime } from "../utils";

export type TicketDocument = mongoose.Document & {
  redNumber: string;
  blueNumber: string;
  ticketStatus: number;
  verifyDate: Date;
  periodId: Types.ObjectId;
  userId: Types.ObjectId;
  orderId: Types.ObjectId;
};

const ticketSchema = new mongoose.Schema<TicketDocument>(
  {
    /**
     * 红球号码
     */
    redNumber: String,
    /**
     * 篮球号码
     */
    blueNumber: String,
    /**
     * 状态
     * @value 0 待开奖 1 已中奖 2 未中奖
     * @default 0
     */
    ticketStatus: {
      type: Number,
      default: 0,
    },
    /**
     * 中奖信息
     */
    winningInfo: {
      type: Object,
    },
    /**
     * 验证时间
     * @type {Date}
     */
    verifyDate: Date,
    /**
     * 期数ID
     * @type {ObjectId}
     * @ref Period
     */
    periodId: {
      type: Types.ObjectId,
      ref: "Period",
    },
    /**
     * 投注倍数
     * @default 0
     */
    multiple: {
      type: Number,
      default: 1,
    },
    /**
     * 用户ID
     * @type {ObjectId}
     * @refs User
     */
    userId: {
      type: Types.ObjectId,
      ref: "User",
    },
    /**
     * 订单编号
     */
    orderId: {
      type: Types.ObjectId,
      ref: "Order",
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret, options) {
        ret.ticketId = ret._id;
        delete ret._id;
        delete ret.__v;
        ret.createdAt && (ret.createdAt = formatTime(ret.createdAt));
        ret.updatedAt && (ret.updatedAt = formatTime(ret.updatedAt));
        return ret;
      },
    },
  }
);

export const Ticket = mongoose.model<TicketDocument>("Ticket", ticketSchema);
