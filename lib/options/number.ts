import { Option } from "#/core/options"


export default Option<number[]>({
  name: "number",
  alias: "n",
  description: "",
  defaults: () => [ 0 ],
  validate: (value: string) => {
    if (Number.isNaN(Number(value))) {
      throw `Number "${value}" is not a number.`
    }
  },
  serialize: (values: string[]) => {
    return values.map(Number)
  }
})
