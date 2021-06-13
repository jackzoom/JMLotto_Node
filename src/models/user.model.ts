import bcrypt from "bcrypt-nodejs";
import mongoose from "mongoose";
import { NextFunction } from "express";

export type UserDocument = mongoose.Document & {
  userId: string;
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
  createTime: Date;
  parentId: string;
  comparePassword: comparePasswordFunction;
};

type comparePasswordFunction = (
  candidatePassword: string,
  cb: (err: any, isMatch: any) => void
) => void;

const userSchema = new mongoose.Schema<UserDocument>(
  {
    userId: { type: String, unique: true },
    openId: { type: String, unique: true },
    avatarUrl: String,
    nickName: String,
    gender: Number,
    country: String,
    province: String,
    city: String,
    language: String,
    unionId: { type: String, unique: true },
    phoneNumber: { type: Number, unique: true },
    countryCode: Number,
    sessionKey: String,
    account: { type: String, unique: true },
    password: String,
    lastLogin: Date,
    createTime: { type: Date, default: Date.now },
    parentId: {
      type: String,
      default: 0
    },
  },
  { timestamps: true }
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
