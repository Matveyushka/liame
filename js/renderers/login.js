import "./common.js"

const loginLabelId = "login-label-email"
const loginInputId = "login-area"
const passwordLabelId = "login-label-password"
const passwordInputId = "password-area"

const validateLogin = (login) => /^[a-zA-Z0-9._%+-]+@mail.ru$/.test(login)

const validatePassword = (password) => password.length > 0

const getLoginInput = () => document.getElementById(loginInputId).innerText

const getPasswordInput = () => document.getElementById(passwordInputId).value

const switchOnInputAlert = (labelId, inputId) => {
  document.getElementById(labelId).classList.add("text-alert")
  document.getElementById(inputId).classList.add("border-alert")
}

const switchOffInputAlert = (labelId, inputId) => {
  document.getElementById(labelId).classList.remove("text-alert")
  document.getElementById(inputId).classList.remove("border-alert")
}

const showLoginPage = () => {
  document.getElementsByClassName("login-page")[0].classList.remove("invisible")
  document.getElementsByClassName("loading-page")[0].classList.add("invisible")
  document.getElementsByClassName("error-page")[0].classList.add("invisible")
}

const showLoader = () => {
  document.getElementsByClassName("login-page")[0].classList.add("invisible")
  document.getElementsByClassName("loading-page")[0].classList.remove("invisible")
  document.getElementsByClassName("error-page")[0].classList.add("invisible")
}

const showErrorPage = (errorMessage) => {
  document.getElementsByClassName("login-page")[0].classList.add("invisible")
  document.getElementsByClassName("loading-page")[0].classList.add("invisible")
  document.getElementsByClassName("error-page")[0].classList.remove("invisible")
  document.getElementById("error-message").innerText = errorMessage
}

const hidePage = () => {
  document.getElementsByClassName("login-page")[0].classList.add("invisible")
  document.getElementsByClassName("loading-page")[0].classList.add("invisible")
  document.getElementsByClassName("error-page")[0].classList.add("invisible")
}

const connect = (login, password) => {
  showLoader()
  window.api.send("mailboxesQuery", { login, password })
}

document.getElementById("button-login").onclick = () => {
  const login = getLoginInput()
  const password = getPasswordInput()

  const loginIsValid = validateLogin(login)
  const passwordIsValid = validatePassword(password)

  if (loginIsValid && passwordIsValid) {
    connect(login, password)
  } else {
    if (!loginIsValid) {
      switchOnInputAlert(loginLabelId, loginInputId)
    }
    if (!passwordIsValid) {
      switchOnInputAlert(passwordLabelId, passwordInputId)
    }
  }
}

document.getElementById(loginInputId).onkeyup = () => {
  if (validateLogin(getLoginInput())) {
    switchOffInputAlert(loginLabelId, loginInputId)
  }
}

document.getElementById(passwordInputId).onkeyup = () => {
  if (validatePassword(getPasswordInput())) {
    switchOffInputAlert(passwordLabelId, passwordInputId)
  }
}

document.getElementById("error-button").onclick = () => {
  showLoginPage()
}

window.api.listen("mailboxesResult", result => {
  if (result.mailboxes.forEach !== undefined) {
    hidePage()
    window.api.send("startMainWindow", result)
  } else if (/Error: Could not open socket/.test("" + result.mailboxes)) {
    showErrorPage("internet connection error")
  } else if (/Error: Authentication failed/.test("" + result.mailboxes)) {
    showErrorPage("authentication failed, check your login and password")
  } else {
    showErrorPage("something went wrong and i do not know what")
  }
})