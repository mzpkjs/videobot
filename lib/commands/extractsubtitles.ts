import { Command, description, name, Options, options, Output, TrackType } from "#/core"
import { input, language, output, retry, verbose } from "#/options"
import ffmpeg, { extract } from "#/executables/ffmpeg"


@Command(
  name("extractsubtitles"),
  description(""),
  options(
    verbose(),
    retry(),
    input(),
    output(),
    language()
  )
)

class ExtractSubtitles implements Command {
  @Output(({ input, output, language }, { path }) =>
    `${path.join(output(), path.basename(input(), path.extname(input())))}.${language()[0]}.srt`
  )
  async execute({ input, output, number }: Options) {
    await ffmpeg(input(), output(), extract(number()[0], TrackType.SUBTITLES))
  }
}

export default Command.register(ExtractSubtitles)
