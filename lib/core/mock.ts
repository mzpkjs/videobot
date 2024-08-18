import * as fsMock from "mock-fs"


export const proxy = <TTarget>(target: TTarget, intercepted: string, callback: (target: TTarget) => void) => {
  return new Proxy<any>(target, {
    get(target, property) {
      return () => {
        if (property === intercepted) {
          callback(target)
        }
        if (typeof target[property] === "function") {
          return target[property]()
        } else {
          return target[property]
        }
      }
    }
  })
}

export const double = <TTarget extends object>(target: TTarget) => {
  return new Proxy<any>(target, {
    get(target, property) {
      return () => {
        if (typeof target[property] === "function") {
          return () => {}
        } else {
          return double(target[property])
        }
      }
    }
  })
}

export const stub = (() => {
  const temp = {
    log: console.log
  }
  return {
    dry: false,
    inject() {
      this.dry = true
      // console.log = () => undefined
      fsMock()
    },
    restore() {
      this.dry = false
      console.log = temp.log
      fsMock.restore()
    }
  }
})()
