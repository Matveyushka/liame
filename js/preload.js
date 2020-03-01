const {
    ipcRenderer,
    contextBridge
} = require("electron")

contextBridge.exposeInMainWorld(
    "api",
    {
        send: (channel, data) => {
            let validChannels = [
                "exit",
                "mailboxesQuery",
                "mainwindowOnStart",
                "messagesQuery",
                "startMainWindow"
            ]
            if (validChannels.includes(channel)) {
                ipcRenderer.send(channel, data)
            }
        },
        receive: (channel, func) => {
            let validChannels = [
                "mailboxesResult",
                "mainwindowOnStartResponse",
                "messagesResponce"
            ]
            if (validChannels.includes(channel)) {
                ipcRenderer.on(channel, (_, ...args) => {
                    func(...args)
                })
            }
        }
    }
)

