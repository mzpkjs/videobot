import { Option } from "#/core/options"


export default Option<string[]>({
  name: "exclude",
  alias: "x",
  description: "",
  defaults: () => {
    return []
  },
  serialize: (values: string[]) => {
    return values
  }
})
