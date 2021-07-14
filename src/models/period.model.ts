/**
 * 开奖表
 */
import mongoose from "mongoose";
import { formatTime } from "../utils";

export type PeriodDocument = mongoose.Document & {
  lotteryRedNumber?: string;
  lotteryBlueNumber?: string;
  lotteryResult?: string;
  lotteryUnsortResult?: string;
  lotteryTime?: Date;
  lotteryRealTime?: Date;
  periodStatus?: number;
  lotteryNumber: number;
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
     * 实际开奖时间
     */
    lotteryRealTime: Date,
    /**
     * 开奖状态
     * @value 0 未开奖 1 已开奖
     */
    periodStatus: {
      type: Number,
      default: 0,
    },
    /**
     * 开奖期数
     */
    lotteryNumber: {
      type: Number,
      unique: true,
    }
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
        ret.lotteryRealTime && (ret.lotteryRealTime = formatTime(ret.lotteryRealTime));
        ret.lotteryTime && (ret.lotteryTime = formatTime(ret.lotteryTime));        
        return ret;
      },
    },
  }
);

export const Period = mongoose.model<PeriodDocument>("Period", periodSchema);
