export const hour = () => {
  const date = new Date()
  return String(date.getHours()).padStart(2, "0")
}

export const minute = () => {
  const date = new Date()
  return String(date.getMinutes()).padStart(2, "0")
}
