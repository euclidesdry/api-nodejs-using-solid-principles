import { expect, describe, it } from 'vitest'
import { compare } from 'bcryptjs';

import { InMemoryUsersRepository } from '~/repositories/in-memory/in-memory-users-repository';

import { UserAlreadyExistsError } from './errors/user-already-exists-error';
import { RegisterUseCase } from './register';

const submittedUserData = {
  name: 'John Doe',
  email: 'Dy5oH@example.com',
  password: '123456',
}

describe('Register Use Case', () => {
  it('should be able to register', async () => {
    const usersRepository = new InMemoryUsersRepository();
    const registerUseCase = new RegisterUseCase(usersRepository);

    const { user } = await registerUseCase.execute(submittedUserData)

    expect(user.id).toEqual(expect.any(String))
  })

  it('should hash user password upon registration', async () => {
    const usersRepository = new InMemoryUsersRepository();
    const registerUseCase = new RegisterUseCase(usersRepository);

    const { user } = await registerUseCase.execute(submittedUserData)

    const isPasswordCorrectlyHashed = await compare(submittedUserData.password, user.password_hash)

    expect(isPasswordCorrectlyHashed).toBe(true)
  })

  it('should not be able to register with same email', async () => {
    const usersRepository = new InMemoryUsersRepository();
    const registerUseCase = new RegisterUseCase(usersRepository);

    await registerUseCase.execute(submittedUserData)

    await expect(registerUseCase.execute(submittedUserData)).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })
})