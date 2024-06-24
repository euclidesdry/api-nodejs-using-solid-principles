import { expect, describe, it, beforeEach } from 'vitest'

import { InMemoryUsersRepository } from '~/repositories/in-memory/in-memory-users-repository';
import { InMemoryCheckInsRepository } from '~/repositories/in-memory/in-memory-check-ins-repository';

import { CheckInUseCase } from './check-in';

let checkInRepository: InMemoryCheckInsRepository;
let sut: CheckInUseCase;

describe('Check-in Use Case', () => {
  beforeEach(async () => {
    checkInRepository = new InMemoryCheckInsRepository();
    sut = new CheckInUseCase(checkInRepository);
  })
  
  it('should be able to check in', async () => {
    const { checkIn } = await sut.execute({
      gymId: 'gym-id',
      userId: 'user-id'
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })
})