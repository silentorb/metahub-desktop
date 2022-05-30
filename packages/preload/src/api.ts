import { contextBridge, ipcRenderer } from 'electron'

const functions = () => [
  'getAllRecords',
  'getRecordContent',
  'copyRecord',
  'deleteRecord',
  'moveRecord',
  'writeRecord',

  'loadConfig',
  'saveConfig',
]

const formatFunctions = () =>
  functions().reduce<{ [key: string]: any }>((a, f) => {
    a[f] = (...args: any[]) => ipcRenderer.invoke(f, ...args)
    return a
  }, {})

export function intializeMetaHubBridgeApi() {
  contextBridge.exposeInMainWorld('electronAPI', formatFunctions())
}
