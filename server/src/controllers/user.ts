import { Context, RouterContext } from '../../deps.ts';
import * as userDB from '../db/user.ts';

export const getUsers = async (ctx: Context) => {
  const users = await userDB.findAllUsers();
  ctx.response.body = users;
};
  
export const getUser = async (ctx: RouterContext<string>) => {
  const id = ctx.params.id!;
  const user = await userDB.findUser(id);
  if (user) {
    ctx.response.body = user;
  } else {
    ctx.response.status = 404;
    ctx.response.body = { message: "User not found" };
  }
};
  
export const createUser = async (ctx: Context) => {
  const user = await ctx.request.body().value;
  const userId = await userDB.createUser(user);
  ctx.response.status = 201;
  ctx.response.body = { id: userId };
};
  
export const updateUser = async (ctx: RouterContext<string>) => {
  const id = ctx.params.id!;
  const userUpdates = await ctx.request.body().value;
  await userDB.updateUser(id, userUpdates);
  ctx.response.body = { message: "User updated" };
};
  
export const deleteUser = async (ctx: RouterContext<string>) => {
  const id = ctx.params.id!;
  await userDB.deleteUser(id);
  ctx.response.status = 204;
};