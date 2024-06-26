import { FastifyInstance } from 'fastify'
import request from 'supertest'

export const mockedUserData = {
  name: 'Peixe Fresco',
  email: 'peixe.fresco@example.com',
  password: '123456'
}

export async function createAndAuthenticateUser(app: FastifyInstance) {
  await request(app.server).post('/users').send(mockedUserData)

  const authResponse = await request(app.server).post('/sessions').send({
    email: mockedUserData.email,
    password: mockedUserData.password
  })

  const { token } = authResponse.body

  return { token: (token as unknown as string) }
}