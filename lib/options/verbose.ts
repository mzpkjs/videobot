import { Option } from "#/core/options"
import { VerbosityLevel } from "#/constants"


export default Option<VerbosityLevel>({
  name: "verbose",
  alias: "v",
  description: "",
  defaults: () => {
    process.env.VERBOSE = String(VerbosityLevel.NONE)
    return Number(process.env.VERBOSE)
  },
  serialize: (values: string[]) => {
    const [ value = "" ] = values
    const level = value
      ? VerbosityLevel[value.toUpperCase() as keyof typeof VerbosityLevel]
      : VerbosityLevel.LOW
    process.env.VERBOSE = String(level)
    return level
  }
})
