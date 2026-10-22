export const StatusFilterOption = {
  ALL: 'All',
  READING: 'Reading',
  FINISHED: 'Finished',
} as const

export type StatusFilterOption = (typeof StatusFilterOption)[keyof typeof StatusFilterOption]
