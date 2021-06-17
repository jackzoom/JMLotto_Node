/**
 * 彩票号码表
 */
import mongoose, { Types } from "mongoose";
import { formatTime } from "../utils";

export type TicketDocument = mongoose.Document & {
  redNumber: String;
  blueNumber: String;
  ticketStatus: Number;
  verifyDate: Date;
  periodId: String;
  userId: String;
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
      type: String,
      ref: "Period",
    },
    /**
     * 用户ID
     * @type {ObjectId}
     * @refs User
     */
    userId: {
      type: String,
      ref: "User",
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