import { AudioCodec, Command, description, name, Options, options, Output, TrackType } from "#/core"
import { exclude, input, output, retry, verbose } from "#/options"
import ffmpeg, { ac, ar, bitrate, codec, copy, filter, loudnorm, map } from "#/executables/ffmpeg"
import ffprobe, { info } from "#/executables/ffprobe"


@Command(
  name("loudnorm"),
  description(""),
  options(
    verbose(),
    retry(),
    input(),
    output(),
    exclude()
  )
)
class Loudnorm implements Command {
  @Output(({ input, output }, { path }) =>
    path.join(output(), path.basename(input()))
  )
  async execute({ input, output, exclude }: Options) {
    const unsupported = [ AudioCodec.TRUEHD, AudioCodec.DTS_HD, AudioCodec.DTS ]
    const streams = await ffprobe(input(), info(TrackType.AUDIO))
    await ffmpeg(
      input(),
      `"${output()}"`,
      ar(48000),
      map(null, TrackType.VIDEO),
      copy(null, TrackType.VIDEO),
      map(null, TrackType.SUBTITLES),
      copy(null, TrackType.SUBTITLES),
      ...streams
        .map((stream, index) => ({ stream, index }))
        .filter(({ index }) => !exclude()?.includes(String(index)))
        .filter(({ stream }) => !unsupported.includes(stream.codec))
        .flatMap(({ stream, index }) => [
          map(index, TrackType.AUDIO),
          filter(
            index,
            loudnorm()
          ),
          ac(stream.channels),
          codec(index, TrackType.AUDIO, codec.audio(stream.codec, stream.channels)),
          bitrate(index, TrackType.AUDIO, bitrate.audio(stream.codec, stream.channels))
        ])
    )
  }
}

export default Command.register(Loudnorm)
