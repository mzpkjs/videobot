import * as path from "path"
import * as fs from "fs"
import * as archiver from "archiver"
import * as zipEncrypted from "archiver-zip-encrypted"


archiver.registerFormat("zip-encrypted", zipEncrypted)


export type ArchiveOptions = {
  compression?: number
  encryption?: "aes256" | "zip20"
  password?: string
}

export const archive = (source: string, destination: string, options?: ArchiveOptions) => {
  const { compression = 0, encryption = "zip20", password } = {...options ?? {} }
  const secure = { encryptionMethod: encryption, password }
  const archive = archiver.create(password ? "zip-encrypted" : "zip", {
    zlib: { level: compression },
    ...(password ? secure : {})
  })
  return new Promise((resolve, reject) => {
    archive.file(source, { name: path.basename(source) })
    const writing = fs.createWriteStream(destination)
    archive.pipe(writing)
    writing.on("close", function () {
      resolve(undefined)
    })
    writing.on("end", function () {
      reject(undefined)
    })
    archive.on("warning", function (error) {
      if (error.code !== "ENOENT") {
        reject(error)
      }
    })
    archive.on("error", function (error) {
      reject(error)
    })
    archive.finalize()
  })
}
