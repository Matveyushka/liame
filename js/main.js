"use strict"

const { app, BrowserWindow, ipcMain, screen } = require("electron")
const {
  openLoginWindow,
  openMainWindow
} = require("./windows.js")
const Mail = require("./mail/mail.js")
const path = require('path')

require('electron-reload')('.')

const createWindow = () => {
  const win = new BrowserWindow({
    frame: false,
    transparent: true,
    webPreferences: {
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  })

  win.webContents.on('dom-ready', () => win.show())

  openLoginWindow(win)

  ipcMain.on("exit", () => app.exit())

  ipcMain.on("mailboxesQuery", async (event, { login, password }) => {
    event.reply("mailboxesResult", { login, password, mailboxes: await Mail.getMailboxes(login, password) })
  })

  ipcMain.on("getMessageReq", async (event, { login, password, path, uid }) => {
    event.reply("getMessageRes", await Mail.getMessage(login, password, path, uid)) 
  })

  ipcMain.on("messagesInfoQuery", async (event, { login, password, path, begin, end }) => {
    event.reply("messagesInfoResponse", {
      path,
      messages: await Mail.getMessagesInfo(login, password, path, begin, end)
    })
  })

  ipcMain.on("startMainWindow", (_, data) => {
    ipcMain.once("mainwindowOnStart", (event) => {
      event.reply("mainwindowOnStartResponse", data)
    })
    openMainWindow(win)
  })

  ipcMain.on("maximize", () => {
    const display = screen.getPrimaryDisplay()
    const maxWidth = display.workArea.width
    const maxHeight = display.workArea.height
    if (win.getSize()[0] === maxWidth && win.getSize()[1] === maxHeight) {
      win.setSize(1000, 500)
      win.center()
    } else {
      win.setSize(maxWidth, maxHeight)
      win.center()
    }
  })

  ipcMain.on("minimize", () => win.minimize())

  ipcMain.on("openCategoryGetMailboxSize", async (event, {login, password, path}) => {
    event.reply("openCategoryResMailboxSize", {
      login,
      password,
      path,
      mailboxSize: await Mail.getMailboxSize(login, password, path)
    })
  })

  ipcMain.on("deleteMessagesReq", async (event, { login, password, path, sequence }) => {
    event.reply("deleteMessagesRes", await Mail.deleteMessages(login, password, path, sequence))
  })

  ipcMain.on("sendMessageReq", async (event, {login, password, to, subject, text, attachments}) => {
    try {
      await Mail.sendMail(login, password, to, subject, text, attachments)
      event.reply("sendMessageRes", "success")
    } catch (error) {
      event.reply("sendMessageRes", error)
    }
  })

  ipcMain.on("markAsReadReq", async (event, { login, password, path, sequence }) => {
    event.reply("markAsReadRes", await Mail.markAsRead(login, password, path, sequence))
  })

  ipcMain.on("logout", () => openLoginWindow(win))
}

app.whenReady().then(createWindow)