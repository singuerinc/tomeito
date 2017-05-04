class ipcRenderer {
  static send (eventName, arg) {
    console.log('fake ipcRenderer', eventName, arg)
  }
}

export {
  ipcRenderer
}
