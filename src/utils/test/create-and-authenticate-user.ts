import { hash } from 'bcryptjs'
import { FastifyInstance } from 'fastify'
import request from 'supertest'

import { prisma } from '~/lib/prisma'

export const mockedUserData = {
  name: 'Peixe Fresco',
  email: 'peixe.fresco@example.com',
  password: '123456'
}

export async function createAndAuthenticateUser(app: FastifyInstance, isAdmin = false) {
  const { name, email, password } = mockedUserData

  await prisma.user.create({
    data: {
      name,
      email,
      role: isAdmin ? 'ADMIN' : 'MEMBER',
      password_hash: await hash(password, 6)
    }
  })

  const authResponse = await request(app.server).post('/sessions').send({
    email: mockedUserData.email,
    password: mockedUserData.password
  })

  const { token } = authResponse.body

  return { token: (token as unknown as string) }
}