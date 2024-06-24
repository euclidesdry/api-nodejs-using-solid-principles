import { expect, describe, it, beforeEach } from 'vitest'

import { InMemoryGymsRepository } from '~/repositories/in-memory/in-memory-gyms-repository';

import { SearchGymsUseCase } from './search-gyms';

const submittedGymData = {
  title: 'Javascript Gym',
  description: 'Gym Description',
  phone: '1234567890',
  latitude: -8.8849738,
  longitude: 13.3444658,
}

let gymsRepository: InMemoryGymsRepository;
let sut: SearchGymsUseCase;


describe('Search Gyms Use Case', () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository();
    sut = new SearchGymsUseCase(gymsRepository);
  })

  it('should be able to search for gyms', async () => {

    await gymsRepository.create(submittedGymData)

    await gymsRepository.create({
      ...submittedGymData,
      title: "Typescript Gym",
    })

    const { gyms } = await sut.execute({
      query: 'Javascript',
      page: 1,
    })

    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([
      expect.objectContaining({ title: submittedGymData.title }),
    ])
  })

  it('should be able to fetch paginated check-in history', async () => {
    for (let i = 1; i <= 22; i++) {
      await gymsRepository.create({
        ...submittedGymData,
        title: `${submittedGymData.title} ${i}`,
      })
    }

    const { gyms } = await sut.execute({ query: 'Javascript', page: 2 })

    expect(gyms).toHaveLength(2)
    expect(gyms).toEqual([
      expect.objectContaining({ title: `${submittedGymData.title} 21` }),
      expect.objectContaining({ title: `${submittedGymData.title} 22` }),
    ])
  })
})