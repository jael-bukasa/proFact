const { contextBridge } = require('electron');

contextBridge.exposeInMainWorld('api', {
  appVersion: '1.0.0',
});