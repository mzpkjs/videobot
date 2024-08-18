export const defineGetter = <TValue>(object: Object, property: PropertyKey, getter: () => TValue): void => {
  Object.defineProperty(object, property, {
    get() {
      return getter()
    }
  })
}
