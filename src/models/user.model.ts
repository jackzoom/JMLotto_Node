/**
 * 用户表
 */
import bcrypt from "bcrypt-nodejs";
import mongoose from "mongoose";
import { NextFunction } from "express";
import { formatTime } from "../utils";

export type UserDocument = mongoose.Document & {
  openId: string;
  avatarUrl: string;
  nickName: string;
  gender: number;
  country: string;
  province: string;
  city: string;
  language: string;
  unionId: string;
  phoneNumber: number;
  countryCode: number;
  password: string;
  sessionKey: string;
  lastLogin: Date;
  parentId: string;
  isAdmin: number;
  comparePassword: comparePasswordFunction;
};

type comparePasswordFunction = (
  candidatePassword: string,
  cb: (err: any, isMatch: any) => void
) => void;

const userSchema = new mongoose.Schema<UserDocument>(
  {
    openId: { type: String, unique: true, sparse: true },
    avatarUrl: String,
    nickName: String,
    gender: { type: Number, default: 0, enum: [0, 1, 2] },
    country: String,
    province: String,
    city: String,
    language: String,
    unionId: { type: String, unique: true, sparse: true },
    phoneNumber: { type: Number, unique: true, sparse: true },
    countryCode: Number,
    sessionKey: String,
    account: { type: String, unique: true, sparse: true, select: false },
    password: {
      type: String,
      select: false,
    },
    lastLogin: Date,
    parentId: {
      type: String,
      default: 0,
    },
    isAdmin: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret, options) {
        ret.userId = ret._id;
        delete ret._id;
        delete ret.__v;
        ret.createdAt && (ret.createdAt = formatTime(ret.createdAt));
        ret.updatedAt && (ret.updatedAt = formatTime(ret.updatedAt));
        return ret;
      },
    },
  }
);

/**
 * Password hash middleware.
 */
userSchema.pre("save", function save(next: NextFunction) {
  const user = this as UserDocument;
  if (!user.isModified("password")) {
    return next();
  }
  bcrypt.genSalt(10, (err: any, salt: any) => {
    if (err) {
      return next(err);
    }
    bcrypt.hash(
      user.password,
      salt,
      undefined,
      (err: mongoose.Error, hash: any) => {
        if (err) {
          return next(err);
        }
        user.password = hash;
        next();
      }
    );
  });
});

const comparePassword: comparePasswordFunction = function (
  candidatePassword,
  cb
) {
  bcrypt.compare(
    candidatePassword,
    this.password,
    (err: mongoose.Error, isMatch: boolean) => {
      cb(err, isMatch);
    }
  );
};

userSchema.methods.comparePassword = comparePassword;

export const User = mongoose.model<UserDocument>("User", userSchema);
