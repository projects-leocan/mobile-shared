const NETWORK_ATTEMPT = [
  1 * 1000,
  2 * 1000,
  5 * 1000,
  5 * 1000,
  20 * 1000,
  60 * 1000,
  3 * 60 * 1000,
  3 * 60 * 1000,
  10 * 60 * 1000,
  20 * 60 * 1000,
  30 * 60 * 1000
]

export default networkStrategy = (retries) => {
  if (retries > 10) {
    return null;
  }

  return NETWORK_ATTEMPT[retries];
}