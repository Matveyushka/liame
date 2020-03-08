import { infoLoaderOn, infoLoaderOff } from "./information_row.js"
import { downloadAttachment } from "../../attachment_downloader/attachment_downloader.js"

const letterArea = document.getElementById("letter-area")

window.api.listen("getMessageRes", result => {
  const letter = document.createElement("div")
  letter.classList.add("letter")

  const addresser = document.createElement("div")
  addresser.classList.add("letter-addressee")
  addresser.innerText = "addresser: " + result.info.from[0].address + ", " + result.info.from[0].openMessage

  const subject = document.createElement("div")
  subject.classList.add("letter-subject")
  subject.innerText = "subject: " + result.info.subject

  const timestamp = document.createElement("div")
  timestamp.classList.add("letter-timestamp")
  timestamp.innerText = new Date(result.info.date).toLocaleString()

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

  const deleteButton = document.createElement("div")
  deleteButton.classList.add("button")
  deleteButton.innerText = "delete"

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

export const openMessage = (login, password, path, uid) => {
  infoLoaderOn()
  letterArea.innerHTML = ""
  window.api.send("getMessageReq", { login, password, path, uid })
}