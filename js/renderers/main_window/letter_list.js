import { openMessage } from "./letter_observer.js"

const mailboxList = document.getElementById("mailbox-list")

const addLetterToList = (login, password, path, messageInfo) => {
  const newLetter = document.createElement("div")
  newLetter.classList.add("letter-row")
  newLetter.classList.add("bordered")
  if (messageInfo.flags.includes("\\Unseen")) {
    newLetter.classList.add("unseen")
  }

  newLetter.onclick = () => openMessage(login, password, path, messageInfo.uid)

  const letterControl = document.createElement("div")
  letterControl.classList.add("letter-control")

  const checkmark = document.createElement("div")
  checkmark.classList.add("checkmark")

  newLetter.check = () => {
    checkmark.classList.add("checked")
    newLetter.checked = true
  }

  newLetter.uncheck = () => {
    checkmark.classList.remove("checked")
    newLetter.checked = false
  }

  checkmark.onclick = (event) => {
    event.stopPropagation()
    if (newLetter.checked) {
      newLetter.uncheck()
    } else {
      newLetter.check()
    }
  }

  letterControl.append(checkmark)
  newLetter.append(letterControl)

  const letterDescription = document.createElement("div")
  letterDescription.classList.add("letter-description")

  const letterFrom = document.createElement("div")
  letterFrom.classList.add("label")
  letterFrom.innerText = messageInfo.envelope.from[0].address

  const letterDatetime = document.createElement("div")
  letterDatetime.classList.add("label")
  letterDatetime.innerText = new Date(messageInfo.envelope.date).toLocaleString()

  const letterSubject = document.createElement("div")
  letterSubject.classList.add("label")
  letterSubject.innerText = messageInfo.envelope.subject

  letterDescription.append(letterFrom)
  letterDescription.append(letterDatetime)
  letterDescription.append(letterSubject)

  newLetter.append(letterDescription)
  newLetter.letterUid = messageInfo.uid

  const loader = document.getElementsByClassName("mailbox-loader-container")[0]

  if (loader) {
    loader.before(newLetter)
  } else {
    mailboxList.append(newLetter)
  }
}

export const fillLettersList = (login, password, path, lettersInfo) => {
  lettersInfo.forEach(letterInfo => {
    addLetterToList(login, password, path, letterInfo)
  });
}

export const switchLoaderOn = () => {
  const loaderContainer = document.createElement("div")
  loaderContainer.classList.add("mailbox-loader-container")

  const loaderBorder = document.createElement("div")
  loaderBorder.classList.add("loader-border")
  loaderBorder.classList.add("bordered")

  const loader = document.createElement("div")
  loader.classList.add("loader")

  loaderBorder.append(loader)

  loaderContainer.append(loaderBorder)

  mailboxList.append(loaderContainer)
}

export const switchLoaderOff = () => {
  const loaderContainer = document.getElementsByClassName("mailbox-loader-container")[0]
  if (loaderContainer) {
    loaderContainer.remove()
  }
}

export const getMarkedLettersUid = () => Array
  .from(document.getElementsByClassName("letter-row"))
  .filter(letter => letter.checked)
  .map(letter => letter.letterUid)

export const removeLetters = (uidList) => {
  Array.from(mailboxList.children).forEach(letter => {
    if (uidList.includes(letter.letterUid)) {
      mailboxList.removeChild(letter)
    }
  }) 
}

export const markAsRead = (uidList) => {
  Array.from(mailboxList.children).forEach(letter => {
    if (uidList.includes(letter.letterUid)) {
      letter.classList.remove("unseen")
    }
  }) 
}

export const markAll = () => {
  const checkable = Array.from(mailboxList.children).filter(div => div.check !== undefined)

  const everyoneChecked = checkable.reduce((a, v) => v.checked && a, true)

  if (everyoneChecked) {
    checkable.forEach(div => div.uncheck())
  } else {
    checkable.forEach(div => div.check())
  }
}