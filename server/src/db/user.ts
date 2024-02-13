import { users } from './index.ts';

export interface User {
  _id?: string;
  name: string;
  email: string;
}

export const findUser = async (id: string) => await users.findOne({ _id: id });
export const findAllUsers = async () => await users.find();
export const createUser = async (user: User) => await users.insertOne(user);
export const updateUser = async (id: string, user: Partial<User>) => await users.updateOne({ _id: id }, { $set: user });
export const deleteUser = async (id: string) => await users.deleteOne({ _id: id });