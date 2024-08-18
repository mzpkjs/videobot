import { Command, description, name, Options, options, Output, Tools } from "#/core"
import { input, output, retry, match, verbose } from "#/options"


@Command(
  name("rename"),
  description("rename file using template string"),
  options(
    verbose(),
    retry(),
    input(),
    output(),
    match()
  )
)
class Rename implements Command {
  @Output(({ input, output, match }, { path }) => {
      const format = (template: string, values: Record<PropertyKey, string>) =>
        template.replace(/{(.*?)}/g, (_, key) => {
            if (values[key]) {
              return values[key]
            } else {
              throw new Error("Invalid template.")
            }
          }
        )
      const [ outputNormalized, template = "" ] = output()
        .split(/[/\\]+/)
        .filter(Boolean)
      const {
        dir: directory,
        name: filename,
        ext: extension
      } = path.parse(match() ?? input())
      const formatted = format(template, { directory, filename, extension })
      return path.join(outputNormalized, formatted || path.basename(match() || input()))
    }
  )
  async execute({ input, output }: Options, { fs }: Tools) {
    fs.copyFileSync(input(), output())
  }
}

export default Command.register(Rename)
