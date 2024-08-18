export enum VerbosityLevel {
  NONE,
  LOW,
  MEDIUM,
  HIGH
}

export const VERBOSE = () => {
  return Number(process.env.VERBOSE)
}

export enum Language {
  ENGLISH = "en",
  POLISH = "pl",
  JAPANESE = "ja"
}
