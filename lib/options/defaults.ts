import { Option } from "#/core/options"


export default Option<boolean[]>({
  name: "defaults",
  alias: "d",
  description: "",
  defaults: (options) =>
    options.language()
      .map((_, index) => index === 0),
  serialize: (values: string[]) => {
    return values.map(value => value === "yes")
  }
})
