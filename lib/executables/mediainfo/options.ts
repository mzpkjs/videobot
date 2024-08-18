import { Chainable, ExecutableOption } from "#/core/executables"


export const duration = (): Chainable<ExecutableOption<string>> =>
  async () => {
    return {
      argument: [
        [ `-show_entries`, `format=duration` ],
        [ `-of`, `csv="p=0"` ]
      ],
      parse: (output: string) => output
    }
  }
