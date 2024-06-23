import fastify from "fastify";

import { appRoutes } from "./http/routes";
import { ZodError } from "zod";
import { env } from "process";

export const app = fastify();

app.register(appRoutes);

app.setErrorHandler((error, _, reply) => {
  if (error instanceof ZodError) {
    return reply.status(400).send({
      message: "Validation error.",
      issues: error.format(),
    });
  } else if (error instanceof Error) {
    return reply.status(500).send({ message: error.message });
  }

  if (env.NODE_ENV !== 'production') {
    console.error(error);
  } else {
    // TODO: Here should be a log to a external tool like DataDog/NewRelic/Sentry
  }

  return reply.status(500).send({
    message: "Internal server error.",
  });
});
