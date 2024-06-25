export class LateCheckInValidationError extends Error {
  constructor() {
    super('The check-in must be at least 20 minutes after its creation.')
  }
}