const { contextBridge, ipcRenderer } = require('electron');
const validChannels = ['ipc-example'];

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    myPing() {
      ipcRenderer.send('ipc-example', 'ping');
    },
    openDialog(method, config) {
      console.log(config);

      return ipcRenderer.invoke('dialog', method, config);
    },
    on(channel, func) {
      if (validChannels.includes(channel)) {
        ipcRenderer.on(channel, (event, ...args) => func(...args));
      }
    },
    once(channel, func) {
      if (validChannels.includes(channel)) {
        ipcRenderer.once(channel, (event, ...args) => func(...args));
      }
    },
  },
});
