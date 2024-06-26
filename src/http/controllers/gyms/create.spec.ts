import request from 'supertest'
import { afterAll, beforeAll, describe, expect, test } from "vitest"

import { app } from '~/app'

import { createAndAuthenticateUser } from '~/utils/test/create-and-authenticate-user'

const mockedGymData = {
  title: 'Javascript Gym',
  description: 'Gym Description',
  phone: '1234567890',
  latitude: -8.8849738,
  longitude: 13.3444658,
}

describe('Create Gym (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  test('should be able to create a gym', async () => {
    const { token } = await createAndAuthenticateUser(app, true)

    const response = await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send(mockedGymData)

    expect(response.statusCode).toEqual(201)
  })
})