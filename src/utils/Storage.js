// const Storage =  {}
//
// Storage.get = function (name) {
//   return JSON.parse(localStorage.getItem(name))
// }
//
// Storage.set = function (name, val) {
//   localStorage.setItem(name, JSON.stringify(val))
// }
//
// Storage.add = function (name, addVal) {
//   let oldVal = Storage.get(name)
//   let newVal = oldVal.concat(addVal)
//   Storage.set(name, newVal)
// }
//
// export default Storage
// export function StorageGet (name) {
//   return JSON.parse(localStorage.getItem(name))
// }
// export function StorageSet (name, val) {
//   localStorage.setItem(name, JSON.stringify(val))
// }
// export function StorageAdd (name, addVal) {
//   let oldVal = Storage.get(name)
//   let newVal = oldVal.concat(addVal)
//   Storage.set(name, newVal)
// }
const Storage = {
  get (name) {
    return JSON.parse(localStorage.getItem(name))
  },
  set (name, val) {
    localStorage.setItem(name, JSON.stringify(val))
  },
  add (name, addVal) {
    let oldVal = Storage.get(name)
    let newVal = oldVal.concat(addVal)
    Storage.set(name, newVal)
  }
}

export default Storage
