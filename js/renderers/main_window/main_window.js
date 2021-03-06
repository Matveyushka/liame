import "../common.js"
import { openCategory, addCategoryButton, getCurrentPath } from "./category_handler.js"
import { getMarkedLettersUid, removeLetters, markAll, markAsRead } from "./letter_list.js"
import { infoShow, infoLoaderOff, infoLoaderOn } from "./information_row.js"
import { startNewLetter } from "./letter_canvas.js"

window.api.listen("mainwindowOnStartResponse", async ({ login, password, mailboxes }) => {
  document.getElementById("account").innerText = login

  const logoutButton = document.getElementById("logout")
  logoutButton.innerText = "< logout"
  logoutButton.onclick = () => window.api.send("logout")

  document.getElementById("mailbox-check-button").onclick = () => markAll()

  document.getElementById("minimize").onclick = () => window.api.send("minimize")

  document.getElementById("maximize").onclick = () => window.api.send("maximize")

  document.getElementById("mailbox-new-letter-button").onclick = () => startNewLetter(login, password)

  document.getElementById("mailbox-delete-button").onclick = () => {
    const markedLetters = getMarkedLettersUid()

    if (markedLetters.length === 0) return
    
    window.api.receive("deleteMessagesRes", (result) => {
      infoLoaderOff()
      if (result.command === "OK") {
        infoShow("deleted successfull")
        removeLetters(markedLetters)
      } else {
        infoShow("oops! something went wrong. unnable to delete")
      }
    })

    infoLoaderOn()

    window.api.send("deleteMessagesReq", {
      login,
      password,
      path: getCurrentPath(),
      sequence: "" + markedLetters
    })
  }

  document.getElementById("mailbox-mark-button").onclick = () => {
    const markedLetters = getMarkedLettersUid()

    if (markedLetters.length === 0) return

    window.api.receive("markAsReadRes", (result) => {
      infoLoaderOff()
      if (result.length > 0) {
        infoShow("marked successfull")
        markAsRead(markedLetters)
      } else {
        infoShow("oops! something went wrong. unnable to mark as read")
      }
    })

    infoLoaderOn()

    window.api.send("markAsReadReq", {
      login,
      password,
      path: getCurrentPath(),
      sequence: "" + markedLetters
    })
  }

  mailboxes.forEach(mailbox => {
    addCategoryButton(mailbox.name, login, password, mailbox.path)
  });
  openCategory(login, password, "INBOX")
})

window.api.send("mainwindowOnStart")
