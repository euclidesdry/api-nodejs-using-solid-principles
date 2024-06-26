import request from 'supertest'
import { afterAll, beforeAll, describe, expect, test } from "vitest"

import { app } from '~/app'
import { prisma } from '~/lib/prisma'

import { createAndAuthenticateUser } from '~/utils/test/create-and-authenticate-user'

const mockedGymData = {
  title: 'Javascript Gym',
  latitude: -8.8849738,
  longitude: 13.3444658,
}

describe('Create Check-in (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  test('should be able to create a check-in', async () => {
    const { token } = await createAndAuthenticateUser(app)

    const gym = await prisma.gym.create({
      data: mockedGymData,
    })

    const response = await request(app.server)
      .post(`/gyms/${gym.id}/check-ins`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        latitude: mockedGymData.latitude,
        longitude: mockedGymData.longitude,
      })

    expect(response.statusCode).toEqual(201)
  })
})