import { Command, description, name, Options, options, Output } from "#/core"
import { defaults, exclude, input, language, number, output, retry, title, verbose } from "#/options"
import mkvmerge, { clean, track } from "#/executables/mkvmerge"
import { zip } from "#/utilities/array"


@Command(
  name("clean"),
  description(""),
  options(
    verbose(),
    retry(),
    input(),
    output(),
    exclude(),
    title(),
    language(),
    defaults(),
    number()
  )
)
class Clean implements Command {
  @Output(({ input, output }, { path }) =>
    path.join(output(), path.basename(input()))
  )
  async execute({ input, output, number, title, language, defaults }: Options) {
    await mkvmerge(
      output(),
      clean(input(), [ `subtitles`, `audio` ]),
      // tracks(
      //   exclude()
      //     .map(excluded => `!${excluded}`)
      // ),
      ...zip<[ number, string, string, boolean ]>(number(), title(), language(), defaults())
        .map(([ index, title, language, defaults ]) =>
          track(input(), { index, title, language, defaults }))
    )
  }
}

export default Command.register(Clean)
