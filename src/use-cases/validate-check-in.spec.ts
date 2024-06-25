import { expect, describe, it, beforeEach, vi, afterEach } from 'vitest'

import { ResourceNotFoundError } from './errors/resource-not-found-error';

import { InMemoryCheckInsRepository } from '~/repositories/in-memory/in-memory-check-ins-repository';

import { ValidateCheckInUseCase } from './validate-check-in';

const mockedCheckInData = {
  gymId: 'gym-01',
  userId: 'user-01',
}

let checkInRepository: InMemoryCheckInsRepository;
let sut: ValidateCheckInUseCase;


describe('Validate Check-in Use Case', () => {
  beforeEach(async () => {
    checkInRepository = new InMemoryCheckInsRepository();
    sut = new ValidateCheckInUseCase(checkInRepository);

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to validate the check-in', async () => {
    const { gymId, userId } = mockedCheckInData

    const createdCheckIn = await checkInRepository.create({
      gym_id: gymId,
      user_id: userId,
    })

    const { checkIn } = await sut.execute({
      checkInId: createdCheckIn.id
    })

    expect(checkIn.validated_at).toEqual(expect.any(Date))
    expect(checkInRepository.items[0].validated_at).toEqual(expect.any(Date))
  })

  it('should not be able to validate a check-in that does not exist', async () => {
    await expect(() => sut.execute({
      checkInId: 'non-existing-check-in-id'
    })).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to validate a check-in after 20 minutes of its creation', async () => {
    vi.setSystemTime(new Date(2022, 0, 1, 13, 40))

    const { gymId, userId } = mockedCheckInData

    const createdCheckIn = await checkInRepository.create({
      gym_id: gymId,
      user_id: userId,
    })

    const twentyOneMinutesInMs = 1000 * 60 * 21;
    vi.advanceTimersByTime(twentyOneMinutesInMs);

    await expect(() => sut.execute({
      checkInId: createdCheckIn.id
    })).rejects.toBeInstanceOf(Error)
  })
})