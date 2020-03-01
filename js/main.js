"use strict"

const parse = require('emailjs-mime-parser')

const { app, BrowserWindow, ipcMain } = require("electron")
const {
  openLoginWindow,
  openMainWindow
} = require("./windows.js")
const { 
  getMailboxes,
  getMessages
} = require("./imap/imap")
const path = require('path')

require('electron-reload')('.')

function createWindow() {
  const win = new BrowserWindow({
    frame: false,
    transparent: true,
    webPreferences: {
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  })
  openLoginWindow(win)

  ipcMain.on("exit", () => app.exit())

  ipcMain.on("mailboxesQuery", async (event, { login, password }) => {
    event.reply("mailboxesResult", { login, password, mailboxes: await getMailboxes(login, password) })
  })

  ipcMain.on("startMainWindow", (_, data) => {
    ipcMain.once("mainwindowOnStart", (event) => {
      event.reply("mainwindowOnStartResponse", data)
    })
    openMainWindow(win)
  })

  ipcMain.on("messagesQuery", async (event, { login, password, path, begin, end }) => {
    event.reply("messagesResponce", await getMessages(login, password, path, begin, end)) 
  })
}

app.whenReady().then(createWindow)
