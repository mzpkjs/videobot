import { Chainable, ExecutableOption, spawn } from "#/core/executables"
import { head, tail } from "#/utilities/array"


/**
 * @example
 * ```
 *  await abav1("output.mkv", track("voice-over.mkv", { name: "Voice-Over", default: true }))
 * ```
 */
const mkvmerge = async <TReturnValue>(
  output: string,
  ...options: Chainable<ExecutableOption>[]
): Promise<TReturnValue> => {
  const { argument = [], parse } = await head(options)?.(output)
  const stdout = await spawn("mkvmerge-static", [
    [ `--output`, `"${output}"` ],
    argument,
    ...(await Promise.all(tail(options).map(option => option?.(output))))
      .map(option => option.argument ?? [])
  ])
  return parse?.(stdout) as TReturnValue
}

export default mkvmerge
