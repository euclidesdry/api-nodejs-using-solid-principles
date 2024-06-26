# Creating an API with NodeJS using solid principles

A GYM APP (API) with NodeJS Using Solid Principles

## GymPass Style App

### FR (Functional Requirements)

- [x] Should be possible for a user to create an account;
- [x] Should be possible for a user to authenticate;
- [x] Should be possible to get an authenticated user profile;
- [x] Should be possible to get several check-ins made by user;
- [x] should be possible to get the check-in history by user;
- [x] Should be possible to search for the closest GYM's (up to 10km);
- [x] Should be possible to search by GYM's name;
- [x] Should be possible to check in a GYM;
- [x] Should be possible to validate a specific user check-in;
- [x] Should be possible to create a GYM;

### BR (Business Rule)

- [x] User should not create a GYM;
- [x] User should not check-in twice (2 times) in the same day;
- [x] User should not check in if he/she is not 100 meters near the GYM;
- [x] Check-in must be validated 20 minutes after being created only;
- [x] Check-in must be validated by an Admin only;
- [x] GYM must be created by an Admin only;

### NFR (Non-Functional Requirements)

- [x] User password must be encrypted;
- [x] App database must be persisted on a PostgreSQL database;
- [x] All data lists (on the API) must be paginated with a 20 items page;
- [x] User must be identified by a JWT (token)
