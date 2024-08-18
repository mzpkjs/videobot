import { Command, description, name, options, Options, Output } from "#/core"
import { audio, defaults, input, language, number, output, retry, subtitles, title, verbose } from "#/options"
import mkvmerge, { clean, track } from "#/executables/mkvmerge"


@Command(
  name("merge"),
  description("merge files into the input's container"),
  options(
    verbose(),
    retry(),
    input(),
    output(),
    audio(),
    subtitles(),
    title(),
    language(),
    defaults(),
    number()
  )
)
class Merge implements Command {
  @Output(({ input, output }, { path }) =>
    path.join(output(), path.basename(input()))
  )
  async execute({ input, output, audio, subtitles, title, language, defaults, number }: Options) {
    await mkvmerge(output(),
      clean(input(), [ `subtitles`, `audio` ]),
      ...audio().map((audio, index) =>
        track(audio, {
          index: number()[index],
          title: title()[index],
          language: language()[index],
          defaults: defaults()[index]
        })
      ),
      ...subtitles().map((subtitle, index) =>
        track(subtitle, {
          index: number()[index],
          title: title()[index],
          language: language()[index],
          defaults: defaults()[index]
        })
      )
    )
  }
}

export default Command.register(Merge)
