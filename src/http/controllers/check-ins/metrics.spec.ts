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

describe('Create Metrics (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  test('should be able to get check-ins total count', async () => {
    const { token } = await createAndAuthenticateUser(app)

    const user = await prisma.user.findFirstOrThrow()

    const gym = await prisma.gym.create({
      data: mockedGymData,
    })

    await prisma.checkIn.createMany({
      data: [
        {
          gym_id: gym.id,
          user_id: user.id,
        },
        {
          gym_id: gym.id,
          user_id: user.id,
        },
      ],
    })

    const response = await request(app.server)
      .get(`/check-ins/metrics`)
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.statusCode).toEqual(200)
    expect(response.body.checkInsCount).toEqual(2)
  })
})