import * as fs from "fs"
import * as path from "path"
import { zip } from "#/utilities/array"
import { exit, info } from "#/utilities/process"
// import * as ui from "#/ui"
import { Input, Option, Options } from "./options"
import { collect, serialize } from "./flags"
import { Descriptor, DescriptorType } from "./descriptors"
import { Mutator } from "#/core/mutators"
import { compose } from "#/utilities/function"
// import { double, proxy, stub } from "#/core/mock"
import { savestate } from "#/core/executables"


export type Class<TInstance = Record<string, unknown>> = {
  new(...varargs: unknown[]): TInstance
}

export type Tools = {
  fs: typeof fs
  path: typeof path
}

export type Execution =
  (filepaths: Options, tools: Tools) => Promise<void>

export type Command = {
  name?: string
  description?: string
  options?: Option<unknown>[]
  mutators?: Mutator[]
  execute: Execution
}

export const registered: Command[] = []

export function Command(...descriptors: Descriptor<unknown>[]) {
  const name = descriptors.find((descriptor): descriptor is Descriptor<string> =>
    descriptor.type === DescriptorType.NAME)?.value
  const description = descriptors.find((descriptor): descriptor is Descriptor<string> =>
    descriptor.type === DescriptorType.DESCRIPTION)?.value
  const options = descriptors.find((descriptor): descriptor is Descriptor<Option<unknown>[]> =>
    descriptor.type === DescriptorType.OPTIONS)?.value ?? []
  return (target: Class<Command>) => {
    target.prototype.name = name ?? target.name
    target.prototype.description = description ?? ""
    target.prototype.options = options ?? []
  }
}

Command.register = (command: Class<Command>): Command => {
  const instance = new command()
  if (instance.name === "help") {
    exit.help = () => execute(instance)
  }
  registered.push(instance)
  return instance
}

export const execute = async (command: Command) => {
  const tools = { fs, path }
  const flags = serialize(
    collect(process.argv.slice(3)),
    command.options ?? []
  )
  const filepaths = flags
    .filter<Option<Input>>((option): option is Option<Input> =>
      Array.isArray(option.value) && option.value.length > 0
        ? option.value.every(Input.isInput)
        : Input.isInput(option.value))
    .map(option => {
      if (Array.isArray(option.value)) {
        const paths: string[] = option.value?.map(filepath => filepath.scan())
        return zip(...paths)
          .map(paths => [ option.name, paths ])
      } else {
        return (option.value?.scan() ?? [])
          .map(path => [ option.name, path ])
      }
    })
  const options = Options.fromArray(Option.toArray(flags))
  // stub.inject()
  // await command.execute(
  //   proxy<Options>(
  //     options,
  //     "output",
  //     () => temp.max = temp.max + 1
  //   ),
  //   { fs: double(fs), path }
  // )
  // stub.restore()
  if (filepaths.length === 0) {
    await command.execute(options, tools)
    return
  }
  // const total = options
  //   .find((option): option is Option<Filepath> => option.name === "input")
  //   ?.value?.scan()
  // ui.command(command.name)
  // ui.inputs(total)
  savestate.load(
    options.output()
      .split(/[/\\]+/)[0]
  )
  for (const zipped of zip<[ string, unknown ][]>(...filepaths)) {
    const mapped = Options.fromArray(zipped)
    if (savestate.has(mapped.input())) {
      continue
    }
    const mutators = (command.mutators ?? [])
      .sort((mutatorA, mutatorB) => mutatorB.priority - mutatorA.priority)
      .map(mutator => mutator.execute)
    const executeThunk = async (retries: number = 3) => {
      const execute = compose<Execution>(...mutators)(command.execute)
      const merged = { ...options, ...mapped }
      try {
        await execute(merged, tools)
        savestate.save(mapped.input())
        return
      } catch (error) {
        if (options.retry?.() && retries > 0) {
          await executeThunk(retries - 1)
          return
        }
        // todo log errors
        console.log(error)
        // fs.rmSync(options.output())
        throw error
      }
    }
    // ui.watch(optionsMapped.input())
    await executeThunk()
    info.completed(mapped.input())
  }
}
