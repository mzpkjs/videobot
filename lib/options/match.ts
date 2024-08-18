import { Input, Option } from "#/core/options"


export default Option<Input>({
  name: "match",
  alias: "m",
  description: "",
  serialize: (values: string[]) => {
    const [ value ] = values
    return new Input(value)
  }
})
