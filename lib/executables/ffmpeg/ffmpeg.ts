import { Chainable, ExecutableOption, spawn } from "#/core"


const ffmpeg = async <TReturnValue>(
  input: string,
  output: string | null,
  option?: Chainable<ExecutableOption<TReturnValue>>,
  ...options: Chainable<ExecutableOption>[]
): Promise<TReturnValue> => {
  const { argument = [], parse } = await option?.(input) ?? {}
  const awaited: ExecutableOption[] = []
  for (const option of options) {
    awaited.push(await option?.(input))
  }
  const stdout = await spawn("ffmpeg-static", [
    [ `-y`, `-hide_banner`, `-i`, `"${input}"` ],
    argument,
    ...awaited
      .map(option => option.argument ?? []),
    [ output === null ? `-f null -` : `"${output}"` ]
  ])
  return (parse?.(stdout) ?? stdout) as TReturnValue
}

export default ffmpeg
