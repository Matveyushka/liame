const {
    ipcRenderer,
    contextBridge
} = require("electron")

contextBridge.exposeInMainWorld(
    "api",
    {
        send: (channel, data) => {
            ipcRenderer.send(channel, data)
        },
        sendSync: (channel, data) => {
            return ipcRenderer.sendSync(channel, data)
        },
        listen: (channel, func) => {
            ipcRenderer.on(channel, (_, ...args) => {
                func(...args)
            })
        },
        receive: (channel, func) => {
            ipcRenderer.once(channel, (_, ...args) => {
                func(...args)
            })
        },
    }
)

