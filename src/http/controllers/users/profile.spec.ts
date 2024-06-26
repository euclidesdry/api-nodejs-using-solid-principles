import request from 'supertest'
import { afterAll, beforeAll, describe, expect, test } from "vitest"

import { app } from '~/app'

const mockedUserData = {
  name: 'Peixe Fresco',
  email: 'peixe.fresco@example.com',
  password: '123456'
}

describe('Profile (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  test('should be able to get user profile', async () => {
    await request(app.server).post('/users').send(mockedUserData)

    const authResponse = await request(app.server).post('/sessions').send({
      email: mockedUserData.email,
      password: mockedUserData.password
    })

    const { token } = authResponse.body

    const response = await request(app.server)
      .get('/me')
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.statusCode).toEqual(200)
    expect(response.body.user).toEqual(expect.objectContaining({
      email: mockedUserData.email,
    }))
  })
})