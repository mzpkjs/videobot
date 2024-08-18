import { Command, description, name, Options, options, Output, TrackType } from "#/core"
import { input, language, number, output, retry, verbose } from "#/options"
import ffprobe, { info } from "#/executables/ffprobe"
import ffmpeg, { extract } from "#/executables/ffmpeg"


@Command(
  name("extractaudio"),
  description(""),
  options(
    verbose(),
    retry(),
    input(),
    output(),
    language(),
    number()
  )
)
class ExtractAudio implements Command {
  @Output(({ input, output, language }, { path }) =>
    `${path.join(output(), path.basename(input(), path.extname(input())))}.${language()[0]}`
  )
  async execute({ input, output, number }: Options) {
    const streams = await ffprobe(input(), info(TrackType.AUDIO))
    const [ index] = number()
    const codec = streams[index]?.codec
    await ffmpeg(input(), `${output()}.${codec}`, extract(index, TrackType.AUDIO))
  }
}

export default Command.register(ExtractAudio)
