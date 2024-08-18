import { Command, description, name, Options, options, Output, TrackType, VideoCodec } from "#/core"
import { configuration, input, output, quality, retry, verbose } from "#/options"
import ffmpeg, { codec, copy, encode, Encoder, ENCODER_PRESETS, EncoderPreset } from "#/executables/ffmpeg"


@Command(
  name("encode"),
  description(""),
  options(
    verbose(),
    retry(),
    input(),
    output(),
    quality(),
    configuration()
  )
)
class Encode implements Command {
  /*
  @Once(({ preset ) => {
    const [ encoder = Encoder.H264, encoder_preset = EncoderPreset.STANDARD ] = preset() as [ Encoder, EncoderPreset ]
    const encoding = ENCODER_PRESETS[encoder][encoder_preset]
    const crf = QUALITY_LEVEL[quality()]
    const best = await abav1(input(), crf, h265.h265params)
    return { best }
  })
   */
  @Output(({ input, output }, { path }) =>
    path.join(output(), path.basename(input()))
  )
  async execute({ input, output, configuration }: Options) {
    // // const crf = QUALITY_LEVEL[quality()]
    // const h265 = H265_PRESETS[preset()]
    // // const best = await abav1(input(), crf, h265.h265params)
    const { encoder, encoder_preset, crf } =
      configuration() as { encoder: Encoder, encoder_preset: EncoderPreset, crf: number }
    // const [ encoder = Encoder.H264, encoder_preset = EncoderPreset.STANDARD ] = preset() as [ Encoder, EncoderPreset ]
    const encoding = ENCODER_PRESETS[encoder][encoder_preset]
    await ffmpeg(
      input(),
      output(),
      codec(null, TrackType.VIDEO, VideoCodec[encoder]),
      encode(encoding, crf),
      copy(null, TrackType.AUDIO),
      copy(null, TrackType.SUBTITLES)
    )
  }
}

export default Command.register(Encode)
