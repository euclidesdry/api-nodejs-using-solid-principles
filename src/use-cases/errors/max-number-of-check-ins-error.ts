export class MaxNumberOfCheckInsError extends Error {
  constructor() {
    super("Max number of check-ins reached. Try again tomorrow.");
  }
}