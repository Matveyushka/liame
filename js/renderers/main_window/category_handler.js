import {
  fillLettersList,
  switchLoaderOn,
  switchLoaderOff
} from "./letter_list.js"

let currentPath = ""
let preventNextMessagesLoading = false
let beginBound = 0
let endBound = 0
let currentLogin = ""
let currentPassword = ""

const getCategoryAlias = (name) => {
  if (name === "INBOX") return "Входящие"
  else return name
}

const getNextBounds = () => {
  beginBound -= 20
  endBound -= 20
  if (beginBound < 1) beginBound = 1
}

export const addCategoryButton = (name, login, password, path) => {
  const buttonArea = document.getElementById("mailbox-categories")

  const newButton = document.createElement("div")
  newButton.classList.add("button")
  newButton.value = path
  newButton.innerText = getCategoryAlias(name)
  newButton.onclick = () => openCategory(login, password, path)

  buttonArea.appendChild(newButton)
}

window.api.listen("messagesInfoResponse", ({path, messages}) => {
  if (path === currentPath) {
    if (/Error/.test("" + messages) === false) {
      fillLettersList(currentLogin, currentPassword, currentPath, messages.reverse())
      console.log("Bound === " + beginBound)
      if (beginBound === 1) {
        switchLoaderOff()
      }
      getNextBounds()
    }
  }
  preventNextMessagesLoading = false
})

export const getCurrentPath = () => currentPath

window.api.listen("openCategoryResMailboxSize", ({ login, password, path, mailboxSize }) => {
  console.log(currentPath)
  if (path !== currentPath) { return }
  endBound = mailboxSize
  beginBound = mailboxSize - 19
  if (beginBound < 1) beginBound = 1

  const loadNextMessages = async () => {
    if (endBound > 0) {
      window.api.send("messagesInfoQuery", {
        login,
        password,
        path,
        begin: beginBound,
        end: endBound,
      })
    } else {
      switchLoaderOff()
    }
  }

  loadNextMessages()

  getNextBounds()

  const mailboxList = document.getElementById("mailbox-list")
  mailboxList.onscroll = (event) => {
    const visibleHeight = event.target.clientHeight
    const scrollHeight = event.target.scrollHeight
    const scrollPosition = event.target.scrollTop
    if (scrollPosition > scrollHeight - visibleHeight * 3 && !preventNextMessagesLoading) {
      preventNextMessagesLoading = true
      loadNextMessages()
    }
  }
})

export const openCategory = async (login, password, path) => {
  if (currentPath === path) { return }
  currentLogin = login
  currentPassword = password

  currentPath = path
  const mailboxList = document.getElementById("mailbox-list")
  mailboxList.innerHTML = ""

  switchLoaderOn()

  window.api.send("openCategoryGetMailboxSize", { login, password, path })
}