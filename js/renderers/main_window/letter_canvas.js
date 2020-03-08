const letterArea = document.getElementById("letter-area")

export const startNewLetter = (login, password) => {
  letterArea.innerHTML = ""

  const newLetter = document.createElement("div")
  newLetter.classList.add("letter")

  const addressee = document.createElement("div")
  addressee.classList.add("letter-addressee")

  const addrLabel = document.createElement("div")
  addrLabel.classList.add("label")
  addrLabel.innerText = "addressee: "

  const addrField = document.createElement("div")
  addrField.contentEditable = true
  addrField.classList.add("letter-text-input")

  addressee.append(addrLabel)
  addressee.append(addrField)

  const subject = document.createElement("div")
  subject.classList.add("letter-subject")

  const subjLabel = document.createElement("div")
  subjLabel.classList.add("label")
  subjLabel.innerText = "subject: "

  const subjField = document.createElement("div")
  subjField.contentEditable = true
  subjField.classList.add("letter-text-input")

  subject.append(subjLabel)
  subject.append(subjField)

  const letterCanvas = document.createElement("div")
  letterCanvas.contentEditable = true
  letterCanvas.classList.add("letter-content")
  letterCanvas.classList.add("letter-text-input")

  const attachments = document.createElement("div")
  attachments.classList.add("letter-attachments")

  const buttons = document.createElement("div")
  buttons.classList.add("letter-buttons")

  const clear = document.createElement("div")
  clear.classList.add("button")
  clear.innerText = "clear"

  clear.onclick = () => {
    addrField.innerHTML = ""
    subjField.innerHTML = ""
    letterCanvas.innerHTML = ""
    attachments.innerHTML = ""
  }

  const add = document.createElement("div")
  add.classList.add("button")
  add.innerText = "add"

  add.onclick = () => {
    var input = document.createElement('input');
    input.type = 'file';

    input.onchange = e => {
      Array.from(e.target.files).forEach(file => {
        const attachmentInfo = document.createElement("div")
        attachmentInfo.classList.add("attachment-info")
        attachmentInfo.fileName = file.name
        attachmentInfo.filePath = file.path
        attachmentInfo.fileType = file.type
        attachmentInfo.innerText = file.name

        const deleteAttachmentButton = document.createElement("div")
        deleteAttachmentButton.classList.add("button")
        deleteAttachmentButton.innerText = "x"
        deleteAttachmentButton.onclick = () => {
          attachments.removeChild(attachmentInfo)
        }

        attachmentInfo.append(deleteAttachmentButton)

        attachments.append(attachmentInfo)
      });
    }

    input.click();
  }

  const send = document.createElement("div")
  send.classList.add("button")
  send.innerText = "send"

  send.onclick = () => {
    const to = addrField.innerText
    const subject = subjField.innerText
    const text = letterCanvas.innerText
    const sendattachments = Array.from(attachments.children).map(attachment => ({
      filename: attachment.fileName,
      path: attachment.filePath,
      contentType: attachment.fileType
    }))

    window.api.send("sendMessageReq", {login, password, to, subject, text, attachments: sendattachments})
  }

  buttons.append(send)
  buttons.append(clear)
  buttons.append(add)

  newLetter.append(addressee)
  newLetter.append(subject)
  newLetter.append(letterCanvas)
  newLetter.append(attachments)
  newLetter.append(buttons)

  letterArea.append(newLetter)
}
