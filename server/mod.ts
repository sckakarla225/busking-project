import { Application } from "./deps.ts";
import { APP_PORT } from "./src/config.ts";
import { userRouter } from "./src/routes/index.ts";

const app = new Application();

app.use(userRouter.routes());
app.use(userRouter.allowedMethods());

await app.listen({ port: +APP_PORT });
console.log(`Server running on port ${APP_PORT}`);