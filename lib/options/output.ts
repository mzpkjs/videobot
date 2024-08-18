import * as fs from "fs"
import * as path from "path"
import { Option } from "#/core/options"
import { savestate } from "#/core"


export default Option<string>({
  name: "output",
  alias: "o",
  required: true,
  description: "",
  serialize: (values: string[]) => {
    const [ value ] = values
    const [ output ] = value
      .split(/[/\\]+/)
      .filter(Boolean)
    if (!fs.existsSync(output)) {
      fs.mkdirSync(output)
    }
    savestate.load(output)
    const files = fs.readdirSync(output)
      .filter(file => file !== path.basename(savestate.savefile))
      .filter(file => !savestate.has(file))
    for (const file of files) {
      fs.rmSync(path.join(output, file), { recursive: true, force: true })
    }
    return value
  }
})
