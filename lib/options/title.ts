import { Option } from "#/core/options"


export default Option<string[]>({
  name: "title",
  alias: "t",
  description: "",
  defaults: (options) => {
    return options.language()
      .map(() => "")
  },
  serialize: (values: string[]) => {
    return values
  }
})
