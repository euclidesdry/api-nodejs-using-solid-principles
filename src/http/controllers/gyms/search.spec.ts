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

describe('Search Gyms (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  test('should be able to search gyms by title', async () => {
    const { token } = await createAndAuthenticateUser(app)

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send(mockedGymData)

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        ...mockedGymData,
        title: 'Typescript Gym',
      })

    const response = await request(app.server)
      .get('/gyms/search')
      .query({ q: 'Javascript' })
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.statusCode).toEqual(200)
    expect(response.body.gyms).toHaveLength(1)
    expect(response.body.gyms).toEqual(expect.arrayContaining([
      expect.objectContaining({ title: mockedGymData.title })
    ]))
  })
})