import { app } from "./app";

app
  .listen({
    host: "0.0.0.0",
    port: 3333,
  })
  .then(() => {
    console.log(`🚀 HTTP Server is Running on port: \x1b[32m${3333}\x1b[0m`);
  });
