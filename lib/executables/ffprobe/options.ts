import { AudioCodec, Chainable, ExecutableOption, extractJSON, TrackType } from "#/core/executables"


export type StreamInfo = {
  index: number
  codec: AudioCodec
  channels: number
  sampleRate: number
}

export const duration = (): Chainable<ExecutableOption<string>> =>
  async () => {
    return {
      argument: [
        [ `-show_entries`, `format=duration` ],
        [ `-of`, `csv="p=0"` ]
      ],
      parse: (output: string) => output
    }
  }

export const info = (type: TrackType): Chainable<ExecutableOption<StreamInfo[]>> =>
  async () => {
    return {
      argument: [
        [ `-select_streams`, type ],
        [ `-show_entries`, `stream=index,codec_name,channels,sample_rate` ],
        [ `-of`, `json` ]
      ],
      parse: (output: string) => {
        const data = extractJSON(output)
        return (data?.streams ?? []).map((stream: Record<string, string>) => ({
          index: Number(stream.index),
          codec: stream.codec_name,
          channels: Number(stream.channels),
          sampleRate: Number(stream.sample_rate)
        }))
      }
    }
  }
