const openLoginWindow = (win) => {
  win.loadFile("html/login.html")
  win.setSize(300, 240)
  win.setResizable(false)
  win.center()
}

const openMainWindow = (win) => {
  win.hide()
  win.loadFile("html/main_window.html")
  win.setSize(1000, 500)
  win.webContents.on('dom-ready', () => {
    win.show()
  })
  win.setResizable(true)
  win.center()
}

module.exports = {
  openLoginWindow,
  openMainWindow
}