import { Command, description, name, registered } from "#/core"


@Command(
  name("help"),
  description("")
)
class Help implements Command {
  async execute() {
    console.native("| Command\t\t\t\t| Description\n")
    const [ invokedCommand ] = process.argv.slice(2)
    const helpful = registered
      .filter(command =>
        invokedCommand === undefined || invokedCommand === "help" || command.name === invokedCommand)
    for (const command of helpful) {
      if (command.name === "help") {
        continue
      }
      console.native(`  ${command.name?.padEnd(16, " ")}\t\t\t  ${command.description}`)
      for (const option of command.options ?? []) {
        const flags = [ option.alias && `-${option.alias}`, option.name && `--${option.name}` ]
          .filter(flag => !!flag)
          .join(", ")
        console.native(`\t${flags.padEnd(24, " ")}\t\t  ${option.description}`)
      }
      console.native("\n")
    }
  }
}

export default Command.register(Help)
