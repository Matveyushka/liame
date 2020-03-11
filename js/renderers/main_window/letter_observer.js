import { infoLoaderOn, infoLoaderOff, infoShow } from "./information_row.js"
import { downloadAttachment } from "../../attachment_downloader/attachment_downloader.js"
import { startNewLetter } from "./letter_canvas.js"
import { removeLetters } from "./letter_list.js"
import { getCurrentPath } from "./category_handler.js"

const letterArea = document.getElementById("letter-area")

export const openMessage = (login, password, path, uid) => {
  infoLoaderOn()
  letterArea.innerHTML = ""

  window.api.receive("getMessageRes", result => {
    if (/Error/.test("" + result)) {
      infoLoaderOff("letter loading failed")
      return
    }

    const addresserString = 
      result.info.from[0].address +
      ((result.info.from[0].openMessage !== undefined) ? (", " + result.info.from[0].openMessage) : "")
  
    const subjectString = result.info.subject !== undefined ? result.info.subject : "<no subject>"
  
    const letter = document.createElement("div")
    letter.classList.add("letter")
  
    const addresser = document.createElement("div")
    addresser.classList.add("letter-addressee")
    addresser.innerText = "addresser: " + addresserString
  
    const timestamp = document.createElement("div")
    timestamp.classList.add("letter-timestamp")
    timestamp.innerText = "timestamp: " + new Date(result.info.date).toLocaleString()
  
    const subject = document.createElement("div")
    subject.classList.add("letter-subject")
    subject.innerText = "subject: " + subjectString
  
    const letterCanvas = document.createElement("div")
    letterCanvas.classList.add("letter-content")
    letterCanvas.innerHTML = result.body.html || result.body.text
  
    const attachments = document.createElement("div")
    attachments.classList.add("letter-attachments")
  
    result.body.attachments.forEach(attachment => {
      const attachmentInfo = document.createElement("div")
      attachmentInfo.classList.add("attachment-info")
      attachmentInfo.innerText = attachment.filename
  
      const attachmentButton = document.createElement("div")
      attachmentButton.classList.add("button")
      attachmentButton.innerText = "v"
      attachmentButton.onclick = () => {
        downloadAttachment(attachment.content, attachment.filename, attachment.contentType)
      }
  
      attachmentInfo.append(attachmentButton)
      attachments.append(attachmentInfo)
    })
  
    const buttons = document.createElement("div")
    buttons.classList.add("letter-buttons")
  
    const answer = document.createElement("div")
    answer.classList.add("button")
    answer.innerText = "answer"
    answer.onclick = () => startNewLetter(login, password)
  
    const deleteButton = document.createElement("div")
    deleteButton.classList.add("button")
    deleteButton.innerText = "delete"
    deleteButton.onclick = () => {
      window.api.receive("deleteMessagesRes", (result) => {
        infoLoaderOff()
        if (result.command === "OK") {
          infoShow("deleted successfull")
          removeLetters([uid])
          letterArea.innerHTML = ""
        } else {
          infoShow("oops! something went wrong. unnable to delete")
        }
      })
  
      infoLoaderOn()
  
      window.api.send("deleteMessagesReq", {
        login,
        password,
        path: getCurrentPath(),
        sequence: "" + uid
      })
    }
  
    buttons.append(answer)
    buttons.append(deleteButton)
  
    letter.append(addresser)
    letter.append(timestamp)
    letter.append(subject)
    letter.append(letterCanvas)
    if (attachments.children.length > 0) {
      letter.append(attachments)
    }
    letter.append(buttons)
    letterArea.append(letter)
  
    infoLoaderOff("letter loaded")
  })

  window.api.send("getMessageReq", { login, password, path, uid })
}