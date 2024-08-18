import { Language } from "#/constants"
import { Option } from "#/core/options"


export default Option<string[]>({
  name: "language",
  alias: "l",
  description: "",
  defaults: () => [ "und" ],
  validate: (value: string) => {
    if (!Object.values<string>(Language).includes(value)) {
      throw `Language "${value}" is not supported.`
    }
  },
  serialize: (values: string[]) => {
    return values
  }
})
