import { Chainable, ExecutableOption, spawn } from "#/core"


const ffprobe = async <TReturnValue>(input: string, probe?: Chainable<ExecutableOption<TReturnValue>>): Promise<TReturnValue> => {
  const { argument = [], parse } = await probe?.(input) ?? {}
  const stdout = await spawn("ffprobe-static", [
    [ `-hide_banner`, `-v quiet`, `-i`, `"${input}"` ],
    argument
  ])
  return parse?.(stdout) as TReturnValue
}

export default ffprobe
