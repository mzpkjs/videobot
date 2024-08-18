import { Input, Option } from "#/core/options"


export default Option<Input[]>({
  name: "subtitles",
  alias: "s",
  description: "",
  defaults: () => {
    return []
  },
  serialize: (values: string[]) => {
    return values.map(value => new Input(value))
  }
})
