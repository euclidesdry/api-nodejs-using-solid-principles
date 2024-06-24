import { expect, describe, it, beforeEach } from 'vitest'

import { InMemoryGymsRepository } from '~/repositories/in-memory/in-memory-gyms-repository'

import { FetchNearbyGymsUseCase } from './fetch-nearby-gyms'

const submittedGymData = {
  title: 'Near Gym',
  description: 'Gym Description',
  phone: '1234567890',
  latitude: -8.8849738,
  longitude: 13.3444658,
}

let gymsRepository: InMemoryGymsRepository;
let sut: FetchNearbyGymsUseCase;


describe('Search Gyms Use Case', () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository();
    sut = new FetchNearbyGymsUseCase(gymsRepository);
  })

  it('should be able to fetch nearby gyms', async () => {

    await gymsRepository.create(submittedGymData)

    await gymsRepository.create({
      ...submittedGymData,
      title: "Far Gym",
      latitude: -8.999752,
      longitude: 13.272401,
    })

    const { gyms } = await sut.execute({
      userLatitude: submittedGymData.latitude,
      userLongitude: submittedGymData.longitude,
    })

    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([
      expect.objectContaining({ title: submittedGymData.title })
    ])
  })
})