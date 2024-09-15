import * as fs from "fs"
import * as child_process from "child_process"
import * as path from "path"
import { stub } from "#/core/mock"
import { info } from "#/utilities/process"
import { VERBOSE } from "#/constants"


export type ExecutableArgument =
  [ string, (string | number)? ] | false | undefined

export type ExecutableOption<TReturnValue = void> = {
  argument: ExecutableArgument[]
  parse?: (output: string) => TReturnValue
}

export enum TrackType {
  VIDEO = "v",
  AUDIO = "a",
  SUBTITLES = "s"
}

export enum VideoCodec {
  H264 = "libx264",
  H265 = "libx265"
}

export enum AudioCodec {
  AAC = "aac",
  AC3 = "ac3",
  EAC3 = "eac3",
  OPUS = "libopus",
  FLAC = "flac",
  DTS = "dts",
  DTS_HD = "dts_hd",
  TRUEHD = "truehd"
}

export type CopyCodec =
  "copy"

export enum Bitrate {
  B64K = "64k",
  B96K = "96k",
  B128K = "128k",
  B160K = "160k",
  B192K = "192k",
  B256K = "256k",
  B320K = "320k",
  B384K = "384k",
  B448K = "448k",
  B512K = "512k",
  B640K = "640k",
  B768K = "768k"
}

export type Chainable<TReturnValue> =
  (target: string, other?: Record<string, any>) => Promise<TReturnValue>

type ExecuteArgs =
  string | number | undefined | false | ExecuteArgs[]

export const spawn = async (binary: string, args: ExecuteArgs[]): Promise<string> => {
  const executableNormalized = getStaticExecutable(binary)
  const argsNormalized = args
    .flat(5)
    .filter((arg): arg is string => !!arg)
    .map((arg) => String(arg).replaceAll(/""([^"]+)""/g, `"$1"`))
  if (stub.dry) {
    return ""
  }
  if (VERBOSE()) {
    info.executed(executableNormalized, argsNormalized)
  }
  const stream = child_process.spawn(
    executableNormalized,
    argsNormalized,
    { shell: true }
  )
  const output: string[] = []
  return new Promise<string>((resolve, reject) => {
    stream.stdout.on("data", (data) => {
      // ui.increment(1)
      const text = String(data)
      output.push(text)
    })
    stream.stderr.on("data", data => {
      // ui.increment(1)
      const text = String(data)
      output.push(text)
    })
    stream.on("close", (code) => {
      if (code === 0) {
        resolve(output.join("\n"))
      } else {
        reject()
      }
    })
    stream.on("error", (error) => {
      reject(error)
    })
  })
}

const getStaticExecutable = (name: string): string => {
  try {
    const executable = require(name)
    if (executable.path !== undefined) {
      return executable.path
    } else {
      return executable
    }
  } catch (error) {
    return name
  }
}

export const extractJSON = (text: string): Record<string, any> => {
  if (stub.dry) {
    return {}
  }
  const [ json ] = text.match(/\{([\s\S]*)}/) ?? []
  try {
    return JSON.parse(json!)
  } catch (error) {
    throw error
  }
}

export const savestate = new class SaveState {
  savefile: string = ".save"
  state: string[] = []

  load(output: string): string[] {
    this.savefile = path.join(output, path.basename(this.savefile))
    if (!fs.existsSync(this.savefile)) {
      fs.writeFileSync(this.savefile, "")
      return []
    } else {
      this.state = fs.readFileSync(this.savefile, "utf-8")
        .split("\n")
      return this.state
    }
  }

  save(input: string): void {
    fs.appendFileSync(this.savefile, path.basename(input) + "\n")
  }

  has(input: string): boolean {
    return this.state.includes(path.basename(input))
  }

  delete(): void {
    if (fs.existsSync(this.savefile)) {
      fs.rmSync(this.savefile)
    }
  }
}
