export const truncate = (text: string, length: number) => {
  return text.length <= length
    ? text
    : text.slice(0, length - 3) + "..."
}
