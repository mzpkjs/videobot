import "./logger"
import { exit, EXIT_MESSAGE } from "#/utilities/process"
import { execute } from "#/core/commands"
// import * as ui from "#/ui"
import * as modulesCommands from "#/commands"
import { savestate } from "#/core"


export default async function main(...varargs: string[]) {
  const [ invokedCommand ] = varargs
  if (!invokedCommand) {
    exit(EXIT_MESSAGE.NO_COMMAND())
  } else {
    const command = modulesCommands[invokedCommand as keyof typeof modulesCommands]
    if (command) {
      // setInterval(ui.render(), 3000)
      await execute(command)
      savestate.delete()
    } else {
      exit(EXIT_MESSAGE.UNKNOWN_COMMAND(invokedCommand))
    }
  }

  process.exit(0)
}

main(
  ...process.argv.slice(2)
    .filter(
      argv =>
        ![
          "\\nodejs\\",
          "\\npm-cache\\",
          "\\node_modules\\",
          __dirname
        ].some(excluded =>
          argv.includes(excluded))
    )
)
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
