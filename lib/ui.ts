// import * as path from "path"
// import color from "ansicolor"
// import { last } from "#/utilities/array"
// import { truncate } from "#/utilities/string"
//
//
// const state = {
//   command: "",
//   inputs: [] as string[],
//   watchers: new Map<string, number>(),
//   increments: {
//     current: 0,
//     average: 0,
//     total: 0
//   }
// }F
//
// export const command = (command: string = ""): void => {
//   state.command = command
// }
//
// export const inputs = (inputs: string[] = []): void => {
//   state.inputs = inputs
//     .map(input => path.basename(input))
// }
//
// export const watch = (file: string): void => {
//   const { watchers, increments } = state
//   const watcher = path.basename(file)
//   watchers.set(watcher, Date.now())
//   increments.total = increments.total + increments.current
//   increments.average = Math.round(increments.total / watchers.size)
//   increments.current = 0
// }
//
// export const increment = (score: number) => {
//   const { increments } = state
//   increments.current = increments.current + score
// }
//
// export const render = () => {
//   return () => {
//     const { command, inputs, watchers, increments } = state
//     const value = (increments.current / increments.average)
//     console.static(`BLANK_LINE_1`, 1)
//     console.static(`HEADER`, 1, [
//       `  Performing "${command}"`.padEnd(63, " "),
//       `File ${inputs.indexOf(last(Array.from(watchers.keys()))) + 1} of ${inputs.length}`
//     ].join(""))
//     const isFirst = watchers.size === 1
//     for (const [ watcher ] of Array.from(watchers.entries()).slice(-5)) {
//       const file = `${truncate(path.basename(watcher, path.extname(watcher)), 75)}` +
//         color.darkGray(` (${path.extname(watcher)})`)
//       if (watcher === last(Array.from(watchers.keys()))) {
//         if (isFirst) {
//           const fakeValue = (1 - Math.exp(-(increments.current - 50) * 0.005))
//           console.progress(watcher, fakeValue, { file, counter: " ? " })
//         } else {
//           console.progress(watcher, value, { file })
//         }
//       } else {
//         console.progress(watcher, 1, { file })
//       }
//     }
//   }
// }
//
// //npx videobot encode -i encode_test_input -o encode_test_output -p animation
// /*
// ffmpeg -y -hide_banner -i "encode_test_input\The Lion Guard.S01E11 [1080p.WEB-DL.H264-FT] [Dubbing PL] [Alusia].mkv" -c:v libx265 -preset slow -tune animation -crf 16 -x265-params "rc-lookahead=40:b-adapt=2:limit-tu=2:bframes=8:limit-sao:rskip=1:rskip-edge-threshold=2:rdoq-level=2:rd=4:psy-rd=2:psy-rdoq=1:tu-intra-depth=4:tu-inter-depth=4:qcomp=0.7:tskip:aq-mode=3:aq-strength=0.7:ctu=32:merange=26" -c:a copy -c:s copy "encode_test_output3\The Lion Guard.S01E11 [1080p.WEB-DL.H264-FT] [Dubbing PL] [Alusia].mkv"
//  */
//
//
// /*
// TODO IDEAS:
// duration in logs
// being able to continue
//  */
