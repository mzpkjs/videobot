import * as path from "path"
import { Command, Execution, Tools } from "./commands"
import { Options, temp } from "./options"


export enum MutatorPriority {
  LOW,
  MEDIUM,
  HIGH
}

export type Mutator = {
  priority: number,
  execute: (execute: Execution) => Execution
}

export const Mutator = (priority: MutatorPriority, mutator: (execute: Execution) => Execution) => {
  return (target: Command, _property: string, _descriptor: PropertyDescriptor) => {
    target.mutators = target.mutators ?? []
    target.mutators.push({
      priority: priority,
      execute: mutator
    })
  }
}


export function Output(mapper: (output: Options, tools: Tools) => string) {
  return Mutator(MutatorPriority.HIGH, (execute) => {
    return (options: Options, tools: Tools) => {
      const output = () => mapper(options, tools)
      return execute({ ...options, output }, tools)
    }
  })
}

export function Temp() {
  return Mutator(MutatorPriority.LOW, (execute) => {
    return (options: Options, tools: Tools) => {
      const { current, next } = temp()
      const temped = {
        ...options,
        input() {
          return path.join(
            path.dirname(options.input()),
            current(),
            path.basename(options.input())
          )
        },
        output() {
          return path.join(
            path.dirname(options.output()),
            next(),
            path.basename(options.output())
          )
        }
      }
      return execute(temped, tools)
    }
  })
}
