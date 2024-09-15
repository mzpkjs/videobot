import { Command, description, name, Options, options, Output } from "#/core"
import { configuration, input, output, retry, verbose } from "#/options"
import { archive } from "#/utilities/filesystem"


@Command(
  name("archive"),
  description(""),
  options(
    verbose(),
    retry(),
    input(),
    output(),
    configuration()
  )
)
class Archive implements Command {
  @Output(({ input, output }, { path }) =>
    path.join(output(), path.basename(input(), path.extname(input())) + ".zip")
  )
  async execute({ input, output, configuration }: Options) {
    const { compression, encryption, password } = configuration()
    await archive(input(), output(), { compression, encryption, password })
  }
}

export default Command.register(Archive)
