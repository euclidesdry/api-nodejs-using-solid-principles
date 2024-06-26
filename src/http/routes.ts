import { FastifyInstance } from "fastify";

import { verifyJWT } from "./middlewares/verify-jwt";

import { authenticate } from "./controllers/authenticate";
import { profile } from "./controllers/profile";
import { register } from "./controllers/register";

export async function appRoutes(app: FastifyInstance) {
  app.post("/users", register);
  app.post("/sessions", authenticate);

  /** Authenticated Routes **/
  app.get('/me', { onRequest: [verifyJWT] }, profile)
}
