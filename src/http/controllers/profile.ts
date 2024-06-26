import { FastifyReply, FastifyRequest } from "fastify";
import { z } from 'zod'

export async function profile(request: FastifyRequest, reply: FastifyReply) {
  await request.jwtVerify()

  // const profileBodySchema = z.object({
  //   name: z.string(),
  //   email: z.string().email()
  // })

  // const { name, email } = profileBodySchema.parse(request.body)

  return reply.code(200).send()
}