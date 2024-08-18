export const head = <T>(array: T[]): T => {
  return array[0]
}

export const last = <T>(array: T[]): T => {
  return array[array.length - 1]
}

export const tail = <T>(array: T[]): T[] => {
  return array.slice(1)
}

export const of = <T>(value: T | T[], ...values: (T | T[])[]): T[] => {
  if (value === undefined) {
    return []
  }
  return Array.isArray(value)
    ? value.concat(of(head(values), ...tail(values)))
    : [ value, ...of(head(values), ...tail(values)) ]
}

export const range = (count: number) => {
  return Array.from(
    { length: count },
    (_, index) => index
  )
}

export const zip = <TValue extends unknown[] = string[]>(...arrays: any[]): TValue[] => {
  arrays = arrays.map(array => array ?? [])
  const length = Math.max(...arrays.map(array => array.length))
  const zipped = Array.from<unknown[], TValue>({ length }, () => [] as unknown as TValue)
  for (let i = 0; i < length; i++) {
    for (let j = 0; j < arrays.length; j++) {
      zipped[i][j] = arrays[j][i]
    }
  }
  return zipped as TValue[]
}

export default {
  of,
  zip
}
