import { User, UserDocument } from "../models/user.model";
import {Query} from "mongoose"

interface DBI<T> {
    getUser(userId: string): object,
    addUser(userInfo: T): string,
    updateUser(userId: string, userInfo: T): object,
    deleteUser(userId: string): boolean,
}

export default class UserDao<T> implements DBI<T> {
    getUser(userId: string): object {
        throw new Error("Method not implemented.");
    }
    addUser(userInfo: T): string {
        throw new Error("Method not implemented.");
    }
    updateUser(userId: string, userInfo: T): object {
        throw new Error("Method not implemented.");
    }
    deleteUser(userId: string): boolean {
        throw new Error("Method not implemented.");
    }

}