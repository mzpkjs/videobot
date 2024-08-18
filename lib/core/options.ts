import * as fs from "fs"
import * as path from "path"
import { ValueOf } from "#/utilities/type"
import { noop } from "#/utilities/function"
import * as modulesOptions from "#/options"


export type Options = {
  [TKey in keyof typeof modulesOptions]: () =>
    NonNullable<
      ReturnType<typeof modulesOptions[TKey]>["value"] extends Input
        ? string
        : ReturnType<typeof modulesOptions[TKey]>["value"] extends Input[]
          ? string[]
          : ReturnType<typeof modulesOptions[TKey]>["value"]
    >
}

export namespace Options {
  export const fromArray = (options: [ string, unknown ][]): Options => {
    return options.reduce<Options>((accumulator, [ name, value ]) => {
      accumulator[name as keyof Options] =
        () => value! as ValueOf<Options[keyof typeof modulesOptions]>
      return accumulator
    }, {} as Options)
  }
}

export type Option<TValue> = {
  name: string
  serialize: (values: string[]) => TValue
  alias?: string
  required?: boolean
  description?: string
  defaults?: (options: Options) => TValue | undefined
  validate?: (value: string) => void | never
  value?: TValue
}

export const Option = <TValue>(option: Option<TValue>) =>
  (override?: Partial<Option<TValue>>): Required<Option<TValue>> => {
    const empty = {
      alias: "",
      required: false,
      description: "",
      defaults: noop,
      validate: noop,
      value: undefined as TValue
    }
    return { ...empty, ...option, ...override ?? {} }
  }

Option.toArray = (options: Option<unknown>[]): [ string, unknown ][] => {
  return options.map(option => [ option.name, option.value ])
}

export class Input {
  directory: string

  static isInput(filepath: unknown): filepath is Input {
    return filepath instanceof Input
  }

  constructor(directory: string) {
    this.directory = directory
  }

  scan(): string[] {
    const traverse = (pathname: string): string[] => {
      if (!fs.existsSync(pathname)) {
        return []
      }
      return fs.readdirSync(pathname, { withFileTypes: true })
        .reduce<string[]>((accumulator, inode) => {
          if (inode.isDirectory() && !inode.name.startsWith("__")) {
            accumulator.push(
              ...traverse(path.join(pathname, inode.name))
            )
          } else if (inode.isFile()) {
            accumulator.push(
              path.join(pathname, inode.name)
            )
          }
          return accumulator
        }, [])
    }
    return traverse(this.directory)
      .sort((fileA, fileB) =>
        fileA.localeCompare(fileB))
  }

  toString() {
    return this.directory
  }


  toBuffer() {
    return this.directory
  }
}

export const temp = () => {
  const state = { index: -1 }
  const template = (index: number) =>
    `__temp${index}`
  return {
    current() {
      return state.index === -1
        ? "" : template(state.index)
    },
    next() {
      state.index = state.index + 1
      return state.index === temp.max
        ? ""
        : template(state.index)
    }
  }
}

temp.max = -1
