import request from 'supertest'
import { afterAll, beforeAll, describe, expect, test } from "vitest"

import { app } from '~/app'
import { prisma } from '~/lib/prisma'

import { createAndAuthenticateUser } from '~/utils/test/create-and-authenticate-user'
import { CheckIn } from '@prisma/client';

const mockedGymData = {
  title: 'Javascript Gym',
  latitude: -8.8849738,
  longitude: 13.3444658,
}

describe('Validate Check-in (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  test('should be able to validate a check-in', async () => {
    const { token } = await createAndAuthenticateUser(app, true)

    const user = await prisma.user.findFirstOrThrow()

    const gym = await prisma.gym.create({
      data: mockedGymData,
    })

    let checkIn = await prisma.checkIn.create({
      data: {
        gym_id: gym.id,
        user_id: user.id,
      },
    })

    const response = await request(app.server)
      .get(`/check-ins/${checkIn.id}/validate`)
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.statusCode).toEqual(204)

    checkIn = await prisma.checkIn.findFirstOrThrow({
      where: {
        id: checkIn.id,
      }
    })

    expect(checkIn.validated_at).toEqual(expect.any(Date))
  })
})