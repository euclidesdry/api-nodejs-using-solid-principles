import { expect, describe, it, beforeEach } from 'vitest'

import { InMemoryCheckInsRepository } from '~/repositories/in-memory/in-memory-check-ins-repository';

import { GetUserMetricsUseCase } from './get-user-metrics';

const mockedCheckInData = {
  gymId: 'gym-0',
  userId: 'user-0',
  userLatitude: -8.894794,
  userLongitude: 13.195640,
}

let checkInsRepository: InMemoryCheckInsRepository;
let sut: GetUserMetricsUseCase;


describe('Get User Metrics Use Case', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository();
    sut = new GetUserMetricsUseCase(checkInsRepository);
  })

  it('should be able to get check-in count from metrics', async () => {
    const { gymId, userId } = mockedCheckInData

    await checkInsRepository.create({
      gym_id: `${gymId}1`,
      user_id: `${userId}1`,
    })

    await checkInsRepository.create({
      gym_id: `${gymId}2`,
      user_id: `${userId}1`,
    })

    const { checkInsCount } = await sut.execute({ userId: `${userId}1` })

    expect(checkInsCount).toEqual(2)
  })
})