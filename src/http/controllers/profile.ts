import { FastifyReply, FastifyRequest } from "fastify";
import { z } from 'zod'

import { makeGetUserProfileUseCase } from "~/use-cases/factories/make-get-user-profile-use-case";

export async function profile(request: FastifyRequest, reply: FastifyReply) {
  const getUserProfileUseCase = makeGetUserProfileUseCase()

  const { user } = await getUserProfileUseCase.execute({
    userId: request.user.sub
  })

  return reply.code(200).send({
    user: {
      ...user,
      password_hash: undefined
    }
  })
}