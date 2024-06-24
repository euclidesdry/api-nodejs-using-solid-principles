import { expect, describe, it, beforeEach } from 'vitest'

import { InMemoryGymsRepository } from '~/repositories/in-memory/in-memory-gyms-repository';

import { CreateGymUseCase } from './create-gym';

let gymRepository: InMemoryGymsRepository;
let sut: CreateGymUseCase;

const submittedGymData = {
  title: 'Javascript Gym',
  description: 'Gym Description',
  phone: '1234567890',
  latitude: -8.8849738,
  longitude: 13.3444658,
}

describe('Check-in Use Case', () => {
  beforeEach(async () => {
    gymRepository = new InMemoryGymsRepository();
    sut = new CreateGymUseCase(gymRepository);
  })

  it('should be able to create a gym', async () => {
    const { gym } = await sut.execute(submittedGymData)
    expect(gym.id).toEqual(expect.any(String))
  })
})