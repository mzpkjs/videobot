import * as readline from "readline"
import color from "ansicolor"
import { identity } from "#/utilities/function"
import { VERBOSE, VerbosityLevel } from "#/constants"
import { clamp } from "#/utilities/number"
// import Ololog = require("ololog")


// type ConsoleLogger = Pick<Console,
//   | "log"
//   | "info"
//   | "warn"
//   | "error"
//   | "debug"
// >

const native = console.log.bind(console)
console.native = native

type Widget = { idx: string, height: number }

class Widgets {
  registry: Widget[] = []

  has(idx: string): boolean {
    return !!this.registry
      .find(widget => widget.idx === idx)
  }

  get(idx: string): number | undefined {
    return this.registry
      .find(widget => widget.idx === idx)?.height
  }

  position(idx: string) {
    return this.registry.slice(0, this.indexOf(idx))
      .reduce((position, widget) =>
        position + widget.height, 0)
  }

  set(idx: string, height: number): void {
    if (this.has(idx)) {
      const widget = this.registry.find(widget => widget.idx === idx)!
      widget.height = height
    } else {
      this.registry.push({ idx, height })
    }
  }

  index(index: number): Widget {
    return this.registry[index]
  }

  indexOf(idx: string): number {
    return this.registry.findIndex(widget => widget.idx === idx)
  }

  register(prefix: string, id: string, height: number): string {
    const idx = `${prefix}-${id}`
    if (this.has(idx)) {
      return idx
    }
    this.set(idx, height)
    return idx
  }
}

const state = {
  lines: 0,
  widgets: new Widgets()
}

const draw = (idx: string, text: string) => {
  const position = rl.getCursorPos().rows + state.lines + state.widgets.position(idx)
  readline.cursorTo(process.stdout, 0, position)
  readline.clearScreenDown(process.stdout)
  process.stdout.write(text)
}

const registerWidget = (prefix: string, id: string, height: number): string => {
  return state.widgets.register(prefix, id, height)
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

rl.on("line", () =>
  state.lines = state.lines + 1)

// const ololog = Ololog.configure({
//   locate: VERBOSE() >= VerbosityLevel.MEDIUM
//     ? { shift: 2 }
//     : false,
//   tag: true,
//   render: (text) => {
//     rl.write(`${text}\n`)
//   }
// })

// const enhanced: ConsoleLogger = {
//   log: ololog,
//   info: ololog.info.bind(ololog),
//   warn: ololog.warn.bind(ololog),
//   error: ololog.error.bind(ololog),
//   debug: ololog.debug.bind(ololog)
// }

// const log = (level: keyof ConsoleLogger) => (...varargs: unknown[]) => {
//   const { lines } = state
//   if (VERBOSE() <= VerbosityLevel.LOW) {
//     readline.cursorTo(process.stdout, 0, lines)
//     readline.clearScreenDown(process.stdout)
//   }
//   enhanced[level](...varargs)
//   console.history.push(varargs)
// }

// console.log = log("log")
// console.info = log("info")
// console.warn = log("warn")
// console.error = log("error")
// console.debug = log("debug")

console.history = []

console.progress = (id: string, value: number, { file, counter } = {}) => {
  if (VERBOSE() > VerbosityLevel.LOW) {
    return
  }
  value = clamp(value, 0, 1)
  const idx = registerWidget("progress", id, 1)
  const complete = "=",
    incomplete = "-"
  const length = 50
  const when = (condition: boolean, color: (text: string) => string) =>
    condition ? color : identity
  const progress = Math.floor(value * length)
  draw(
    idx,
    when(value === 1, color.darkGray)([
        `\r`,
        [
          when(value < 1, color.cyan)("["),
          when(value < 1, color.cyan)(complete.repeat(progress)),
          color.darkGray(incomplete.repeat(length - progress)),
          when(value < 1, color.cyan)("]")
        ].join(""),
        when(value < 1, color.cyan)(
          counter
            ? counter : `${String(Math.floor(value * 100)).padStart(3, " ")}%`
        ),
        file && ` ->  ${file}`
      ]
        .filter(Boolean)
        .join(" ")
    )
  )
}

console.static = (id: string, height: number, text: string = "") => {
  if (VERBOSE() > VerbosityLevel.LOW) {
    return
  }
  const idx = registerWidget("static", id, height)
  draw(idx, text)
}

/*
const readline = require('readline');
const {stdin, stderr} = process;
const rl = readline.createInterface({
    output: stderr,
    input: stdin
})

console.log(rl.getCursorPos());
 */
