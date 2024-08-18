import { spawn } from "#/core"


const abav1 = async (input: string, crf: number, h265params: string): Promise<{ crf: number, vmaf: number }> => {
  const minimum = 16
  const output = await spawn("ab-av1", [
    [
      `crf-search`,
      `--encoder libx265`,
      `--min-crf ${minimum - 1}`,
      `--max-crf ${crf + 1}`,
      `--enc x265-params="${h265params}"`,
      `--input "${input}"`
    ]
  ])
  console.log(output)
  const match = output.match(/crf (\d+(\.\d+)?) VMAF (\d+(\.\d+)?)/)
  if (match) {
    const crf = Number(match[1])
    const vmaf = Number(match[3])
    return { crf, vmaf }
  } else {
    return { crf: 0, vmaf: 0 }
  }
}

export default abav1
