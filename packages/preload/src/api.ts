import { contextBridge, ipcRenderer } from 'electron'

const functions = () => [
  'getAllRecords',
]

const formatFunctions = () =>
  functions().reduce<{ [key: string]: any }>((a, f) => {
    a[f] = () => ipcRenderer.invoke(f)
    return a
  }, {})

contextBridge.exposeInMainWorld('electronAPI', formatFunctions())

export const dummy = 1
