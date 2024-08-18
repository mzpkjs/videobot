import { spawn } from "#/core"


const mediainfo = async (input: string): Promise<Record<string, unknown>> => {
  const output = await spawn("abav1-static", [
    [ "--output=JSON", `"${input}"` ]
  ])
  return JSON.parse(output.replaceAll("\n", ""))
}

export default mediainfo
