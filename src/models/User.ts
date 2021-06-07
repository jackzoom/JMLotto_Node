import bcrypt from "bcrypt-nodejs";
import mongoose from "mongoose";
import { NextFunction } from "express";

export type UserDocument = mongoose.Document & {
  email: string;
  password: string;
  comparePassword: comparePasswordFunction;
};

type comparePasswordFunction = (
  candidatePassword: string,
  cb: (err: any, isMatch: any) => void
) => void;

export interface AuthToken {
  accessToken: string;
  kind: string;
}

const userSchema = new mongoose.Schema<UserDocument>(
  {
    email: { type: String, unique: true },
    password: String,
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
