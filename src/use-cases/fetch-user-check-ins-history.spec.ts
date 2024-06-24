import { expect, describe, it, beforeEach } from 'vitest'

import { InMemoryCheckInsRepository } from '~/repositories/in-memory/in-memory-check-ins-repository';

import { FetchUsersCheckInsHistoryUseCase } from './fetch-user-check-ins-history';

const mockedCheckInData = {
  gymId: 'gym-0',
  userId: 'user-0',
  userLatitude: -8.894794,
  userLongitude: 13.195640,
}

let checkInsRepository: InMemoryCheckInsRepository;
let sut: FetchUsersCheckInsHistoryUseCase;


describe('Fetch User Check-In History Use Case', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository();
    sut = new FetchUsersCheckInsHistoryUseCase(checkInsRepository);
  })

  it('should be able to fetch check-in history', async () => {
    const { gymId, userId } = mockedCheckInData

    await checkInsRepository.create({
      gym_id: `${gymId}1`,
      user_id: `${userId}1`,
    })

    await checkInsRepository.create({
      gym_id: `${gymId}2`,
      user_id: `${userId}1`,
    })

    const { checkIns } = await sut.execute({ userId: `${userId}1`, page: 1 })

    expect(checkIns).toHaveLength(2)
    expect(checkIns).toEqual([
      expect.objectContaining({ gym_id: `${gymId}1` }),
      expect.objectContaining({ gym_id: `${gymId}2` }),
    ])
  })

  it('should be able to fetch paginated check-in history', async () => {
    const { gymId, userId } = mockedCheckInData

    for (let i = 1; i <= 22; i++) {
      await checkInsRepository.create({
        gym_id: `${gymId}${i}`,
        user_id: `${userId}1`,
      })
    }

    const { checkIns } = await sut.execute({ userId: `${userId}1`, page: 2 })

    expect(checkIns).toHaveLength(2)
    expect(checkIns).toEqual([
      expect.objectContaining({ gym_id: `${gymId}21` }),
      expect.objectContaining({ gym_id: `${gymId}22` }),
    ])
  })
})