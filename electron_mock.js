class ipcRenderer {
  static send (eventName, arg) {
    console.log('fake ipcRenderer send', eventName, arg)
  }

  static sendSync (eventName, arg) {
    console.log('fake ipcRenderer sendSync', eventName, arg)
    if (eventName === 'has-app-update') {
      return true
    }
  }

  static on (eventName, func) {
    console.log('fake ipcRenderer on', eventName)
  }
}

export {
  ipcRenderer
}
