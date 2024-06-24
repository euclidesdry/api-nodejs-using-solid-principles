import { expect, describe, it, beforeEach } from 'vitest'
import { compare } from 'bcryptjs';

import { InMemoryUsersRepository } from '~/repositories/in-memory/in-memory-users-repository';

import { UserAlreadyExistsError } from './errors/user-already-exists-error';
import { RegisterUseCase } from './register';

let usersRepository: InMemoryUsersRepository;
let sut: RegisterUseCase;

const submittedUserData = {
  name: 'John Doe',
  email: 'Dy5oH@example.com',
  password: '123456',
}

describe('Register Use Case', () => {
  beforeEach(async () => {
    usersRepository = new InMemoryUsersRepository();
    sut = new RegisterUseCase(usersRepository);
  })
  
  it('should be able to register', async () => {
    const { user } = await sut.execute(submittedUserData)

    expect(user.id).toEqual(expect.any(String))
  })

  it('should hash user password upon registration', async () => {
    const { user } = await sut.execute(submittedUserData)

    const isPasswordCorrectlyHashed = await compare(submittedUserData.password, user.password_hash)

    expect(isPasswordCorrectlyHashed).toBe(true)
  })

  it('should not be able to register with same email', async () => {
    await sut.execute(submittedUserData)

    await expect(sut.execute(submittedUserData)).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })
})