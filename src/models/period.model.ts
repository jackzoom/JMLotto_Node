/**
 * 开奖表
 */
import mongoose, { Types } from "mongoose";
import { formatTime } from "../utils";

export type PeriodDocument = mongoose.Document & {
  lotteryRedNumber: String;
  lotteryBlueNumber: String;
  lotteryResult: string;
  lotteryUnsortResult: string;
  lotteryTime: Date;
  lotteryNumber: String;
};

const periodSchema = new mongoose.Schema<PeriodDocument>(
  {
    /**
     * 开奖：红球号码
     */
    lotteryRedNumber: String,
    /**
     * 开奖：篮球号码
     */
    lotteryBlueNumber: String,
    /**
     * 开奖完整号码
     */
    lotteryResult: String,
    /**
     * 开奖未排序完整号码
     */
    lotteryUnsortResult: String,
    /**
     * 开奖时间
     */
    lotteryTime: Date,
    /**
     * 开奖期数
     */
    lotteryNumber: {
      type: String,
      unique: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret, options) {
        ret.periodId = ret._id;
        delete ret._id;
        delete ret.__v;
        ret.createdAt && (ret.createdAt = formatTime(ret.createdAt));
        ret.updatedAt && (ret.updatedAt = formatTime(ret.updatedAt));
        return ret;
      },
    },
  }
);

export const Period = mongoose.model<PeriodDocument>("Period", periodSchema);
