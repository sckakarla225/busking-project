import { Router } from '../../deps.ts';
import * as userController from '../controllers/user.ts';

const router = new Router();

router
  .get('/', (ctx) => {
    ctx.response.body = 'Performers API';
  })
  .get("/users", userController.getUsers)
  .get("/users/:id", userController.getUser)
  .post("/users", userController.createUser)
  .put("/users/:id", userController.updateUser)
  .delete("/users/:id", userController.deleteUser);

export default router;