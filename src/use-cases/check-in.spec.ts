import { Decimal } from '@prisma/client/runtime/library';
import { expect, describe, it, beforeEach, vi, afterEach } from 'vitest'

import { InMemoryCheckInsRepository } from '~/repositories/in-memory/in-memory-check-ins-repository';
import { InMemoryGymsRepository } from '~/repositories/in-memory/in-memory-gyms-repository';

import { CheckInUseCase } from './check-in';

const mockedCheckInData = {
  gymId: 'gym-id-1',
  userId: 'user-id',
  userLatitude: -8.894794,
  userLongitude: 13.195640,
}

let checkInRepository: InMemoryCheckInsRepository;
let gymsRepository: InMemoryGymsRepository;
let sut: CheckInUseCase;


describe('Check-in Use Case', () => {
  beforeEach(async () => {
    checkInRepository = new InMemoryCheckInsRepository();
    gymsRepository = new InMemoryGymsRepository();
    sut = new CheckInUseCase(checkInRepository, gymsRepository);

    gymsRepository.items.push({
      id: mockedCheckInData.gymId,
      phone: 'Gym Phone',
      title: 'Javascript Gym',
      description: 'Gym Description',
      latitude: new Decimal(mockedCheckInData.userLatitude),
      longitude: new Decimal(mockedCheckInData.userLongitude),
    })

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to check in', async () => {
    const { gymId, userId, userLatitude, userLongitude } = mockedCheckInData

    const { checkIn } = await sut.execute({
      gymId,
      userId,
      userLatitude,
      userLongitude,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in twice in the same gym', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

    const { gymId, userId, userLatitude, userLongitude } = mockedCheckInData

    await sut.execute({
      gymId,
      userId,
      userLatitude,
      userLongitude,
    })

    await expect(() =>
      sut.execute({
        gymId,
        userId,
        userLatitude,
        userLongitude,
      })
    ).rejects.toBeInstanceOf(Error)
  })

  it('should not be able to check in twice but in different days', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

    const { gymId, userId, userLatitude, userLongitude } = mockedCheckInData

    await sut.execute({
      gymId,
      userId,
      userLatitude,
      userLongitude,
    })

    vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0))

    const { checkIn } = await sut.execute({
      gymId,
      userId,
      userLatitude,
      userLongitude,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check-in on distant gyms', async () => {
    const { gymId, userId, userLatitude, userLongitude } = mockedCheckInData

    gymsRepository.items.push({
      id: `${mockedCheckInData.gymId}2`,
      phone: 'Gym Phone',
      title: 'Javascript Gym',
      description: 'Gym Description',
      latitude: new Decimal(-8.8849738),
      longitude: new Decimal(13.3444658),
    })

    await expect(() =>
      sut.execute({
        gymId: `${gymId}2`,
        userId,
        userLatitude,
        userLongitude,
      })
    ).rejects.toBeInstanceOf(Error)
  })
})