import { exit, EXIT_MESSAGE } from "#/utilities/process"
import { Option, Options } from "#/core/options"
import { range } from "#/utilities/array"


export const collect = (strings: string[]): Map<string, string[]> => {
  const reMarkings = /^-{1,2}/
  const dictionary = new Map()
  let current: string | null = null
  for (const string of strings) {
    if (reMarkings.test(string)) {
      current = string.replace(reMarkings, "")
      dictionary.set(current, [])
    } else {
      if (current) {
        dictionary.get(current)
          ?.push(string)
      }
    }
  }
  return dictionary
}

export const serialize = (flags: Map<string, string[]>, options: Option<unknown>[]): Option<unknown>[] => {
  const serialized = options
    .map(populate(flags))
  const defaulted = range(3)
    .reduce((options) =>
        options
          .map(defaults(options))
      , serialized)
  const missing = defaulted
    .filter(option => option.required)
    .filter(option => option.value === undefined)
    .map(option => option.name)
  if (missing.length > 0) {
    exit(EXIT_MESSAGE.MISSING_FLAGS(missing))
  }
  return defaulted
}

export const populate = (flags: Map<string, string[]>) => (option: Option<unknown>): Option<unknown> => {
  const values =
    flags.get(option.alias ?? option.name)
    ?? flags.get(option.name)
  if (values) {
    for (const value of values) {
      try {
        option.validate?.(value)
      } catch (error) {
        exit(error as string)
      }
    }
    const value = option.serialize(values)
    return { ...option, value }
  }
  return option
}

export const defaults = (options: Option<unknown>[]) => (option: Option<unknown>): Option<unknown> => {
  if (option.value === undefined && option.defaults !== undefined) {
    try {
      const value = option.defaults(Options.fromArray(Option.toArray(options)))
      return { ...option, value }
    } catch (error) {
      // try again
    }
  }
  return option
}
