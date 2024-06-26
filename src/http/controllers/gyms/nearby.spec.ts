import request from 'supertest'
import { afterAll, beforeAll, describe, expect, test } from "vitest"

import { app } from '~/app'

import { createAndAuthenticateUser } from '~/utils/test/create-and-authenticate-user'

const mockedGymData = {
  title: 'Near Gym',
  description: 'Gym Description',
  phone: '908927348',
  latitude: -8.8849738,
  longitude: 13.3444658,
}

describe('Nearby Gyms (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  test('should be able to list nearby gyms', async () => {
    const { token } = await createAndAuthenticateUser(app, true)

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send(mockedGymData)

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        ...mockedGymData,
        title: "Far Gym",
        latitude: -8.999752,
        longitude: 13.272401,
      })

    const response = await request(app.server)
      .get('/gyms/nearby')
      .query({
        latitude: mockedGymData.latitude,
        longitude: mockedGymData.longitude
      })
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.statusCode).toEqual(200)
    expect(response.body.gyms).toHaveLength(1)
    expect(response.body.gyms).toEqual(expect.arrayContaining([
      expect.objectContaining({ title: mockedGymData.title })
    ]))
  })
})