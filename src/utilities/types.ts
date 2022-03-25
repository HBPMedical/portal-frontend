export type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;

export const enum SessionState {
  INIT = 0,
  LOGGED_IN = 1,
  INVALID = 2,
  LOGGED_OUT = 3,
  ERROR = 4,
  ACCESS_DENIED = 5
}
