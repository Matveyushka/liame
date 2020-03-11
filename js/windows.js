const openLoginWindow = (win) => {
  win.hide()
  win.loadFile("html/login.html")
  win.setMinimumSize(300, 240)
  win.setSize(300, 240)
  win.setResizable(false)
  win.center()
}

const openMainWindow = (win) => {
  win.hide()
  win.loadFile("html/main_window.html")
  win.setSize(1000, 500)
  win.setResizable(true)
  win.setMinimumSize(900, 400)
  win.center()
}

module.exports = {
  openLoginWindow,
  openMainWindow
}