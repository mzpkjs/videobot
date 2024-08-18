import { Input, Option } from "#/core/options"


export default Option<Input>({
  name: "input",
  alias: "i",
  required: true,
  description: "",
  serialize: (values: string[]) => {
    const [ value ] = values
    return new Input(value)
  }
})
