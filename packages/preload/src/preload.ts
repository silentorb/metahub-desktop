import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electronAPI',{
  test: () => ipcRenderer.invoke('test2')
})
