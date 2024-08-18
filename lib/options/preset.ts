import { Option } from "#/core/options"


export default Option<string[]>({
  name: "preset",
  alias: "p",
  description: "",
  required: true,
  serialize: (values: string[]) => {
    return values.map(value => value.toUpperCase())
  }
})
