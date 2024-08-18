export type VariadicFunction<TResult, TParameters extends unknown[]> =
  (...varargs: TParameters) => TResult

export const noop = (..._: unknown[]) =>
  undefined

export const identity = (value: any) =>
  value

export const compose = <TReturnValue>(...functions: VariadicFunction<any, any>[]): VariadicFunction<TReturnValue, any> => {
  const [ first = identity, ...rest ] = functions
  return rest.reduce((g, f) =>
    (...varargs) => g(f(...varargs)), first)
}
