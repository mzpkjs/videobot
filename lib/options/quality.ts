import { Option } from "#/core/options"
import { QUALITY_LEVEL } from "#/executables/ffmpeg"


export default Option<keyof typeof QUALITY_LEVEL>({
  name: "quality",
  alias: "q",
  description: "",
  defaults: () => {
    return "HIGH"
  },
  serialize: (values: string[]) => {
    const [ value ] = values
    return value.toUpperCase() as keyof typeof QUALITY_LEVEL
  }
})
