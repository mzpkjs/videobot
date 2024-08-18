import { Option } from "#/core/options"


export default Option<Record<any, any>>({
  name: "configuration",
  alias: "c",
  description: "",
  required: true,
  serialize: (values: string[]) => {
    return Object.fromEntries(
      values
        .map(value => value.split(":"))
        .map(([ key, value = null ]) => {
          if (!Number.isNaN(Number(value))) {
            return [ key, Number(value) ]
          }
          if (value === null) {
            return [ key, true ]
          }
          return [ key, String(value).toUpperCase() ]
        })
    )
  }
})
