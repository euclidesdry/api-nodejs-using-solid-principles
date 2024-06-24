import { expect, describe, it, beforeEach } from 'vitest'

import { InMemoryUsersRepository } from '~/repositories/in-memory/in-memory-users-repository';
import { InMemoryCheckInsRepository } from '~/repositories/in-memory/in-memory-check-ins-repository';

import { CheckInUseCase } from './check-in';

const mockedCheckInData = {
      gymId: 'gym-id',
      userId: 'user-id'
    }

let checkInRepository: InMemoryCheckInsRepository;
let sut: CheckInUseCase;

describe('Check-in Use Case', () => {
  beforeEach(async () => {
    checkInRepository = new InMemoryCheckInsRepository();
    sut = new CheckInUseCase(checkInRepository);
  })
  
  it('should be able to check in', async () => {
    const { gymId, userId } = mockedCheckInData

    const { checkIn } = await sut.execute({
      gymId,
      userId,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in twice in the same gym', async () => {
    const { gymId, userId } = mockedCheckInData

    await sut.execute({
      gymId,
      userId,
    })

    await expect(() =>
      sut.execute({
        gymId,
        userId,
      })
    ).rejects.toBeInstanceOf(Error)
  })
})