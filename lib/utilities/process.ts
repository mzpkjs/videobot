import * as path from "path"
import * as date from "#/utilities/date"
import color from "ansicolor"
import Ololog = require("ololog")


export const EXIT_MESSAGE = {
  NO_COMMAND: () =>
    `No command was specified.`,
  UNKNOWN_COMMAND: (command: string) =>
    `Unknown command: ${command}.`,
  MISSING_FLAGS: (missing: string[]) =>
    `Missing required flags: ${missing.map(option => `--${option}`).join(", ")}`
}

const log = Ololog.configure({
  locate: false,
  tag: true
})

export const exit = (message?: string) => {
  if (message) {
    log.error(`${message}\n`)
  }
  exit.help()
  process.exit(1)
}

exit.help = (): void =>
  undefined

export const info = {
  completed: (input: string): void => {
    const file = color.cyan(`${path.basename(input)}`),
      time = color.cyan(`${date.hour()}:${date.minute()}`)
    return log.info(`Successfully completed "` + file + `" at ` + time + `.`)
  },
  executed: (executable: string, args: string[]): void => {
    const command = path.basename(executable, path.extname(executable))
    return log.debug(`Executing:\n` + color.cyan(`${command}`) + " " + color.darkGray(`${args.join(" ")}`))
  }
}
