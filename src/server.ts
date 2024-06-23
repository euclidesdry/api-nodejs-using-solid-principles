import { env } from "./env";
import { app } from "./app";

app
  .listen({
    host: "0.0.0.0",
    port: env.PORT,
  })
  .then(() => {
    console.log(`🚀 HTTP Server is Running on port \x1b[32m${env.PORT}\x1b[0m`);
  });
