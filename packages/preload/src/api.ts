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
    a[f] = (...args: any[]) => {
      const result = ipcRenderer.invoke(f, ...args)
      // Convert the response to a Task in order to match the original API signature (all the endpoints are Tasks)
      return () => result
    }
    return a
  }, {})

export function intializeMetaHubBridgeApi() {
  contextBridge.exposeInMainWorld('electronAPI', formatFunctions())
}
