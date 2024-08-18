import { Option } from "#/core/options"


export default Option<boolean>({
  name: "retry",
  alias: "r",
  description: "",
  defaults: () => {
    return false
  },
  serialize: () => {
    return true
  }
})
