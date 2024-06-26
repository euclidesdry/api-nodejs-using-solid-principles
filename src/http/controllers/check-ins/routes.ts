import { FastifyInstance } from "fastify";
import { verifyJWT } from "~/http/middlewares/verify-jwt";

import { metrics } from "./metrics";
import { history } from "./history";
import { create } from "./create";
import { validate } from "./validate";
import { verifyUserRole } from "~/http/middlewares/verify-user-role";

export async function checkInsRoutes(app: FastifyInstance) {
  app.addHook("onRequest", verifyJWT);

  app.get('/check-ins/metrics', metrics)
  app.get('/check-ins/history', history)

  app.post('/gyms/:gymId/check-ins', create)
  app.get('/check-ins/:checkInId/validate', { onRequest: [verifyUserRole("ADMIN")] }, validate)
}
