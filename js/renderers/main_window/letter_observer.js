import { mimeToHtml } from "../../mime/mime.js"
import { infoLoaderOn, infoLoaderOff } from "./information_row.js"

const letterArea = document.getElementById("letter-area")

window.api.listen("getMessageRes", result => {
  console.log(result)
  const from = document.createElement("div")
  from.classList.add("label")
  from.innerText = "from: " + result.info.from[0].address + ", " + result.info.from[0].openMessage

  const date = document.createElement("div")
  date.classList.add("label")
  date.innerText = "timestamp: " + new Date(result.info.date).toLocaleString()

  const subject = document.createElement("div")
  subject.classList.add("label")
  subject.innerText = "subject: " + result.info.subject

  const divider = document.createElement("div")
  divider.classList.add("divider")
  
  letterArea.append(from)
  letterArea.append(date)
  letterArea.append(subject)
  letterArea.append(divider)
  letterArea.append(mimeToHtml(result.body))
  infoLoaderOff("letter " + (result.info.subject !== undefined ? (result.info.subject + " ") : "") + "loaded")
}) 

export const openMessage = (login, password, path, uid) => {
  infoLoaderOn()
  letterArea.innerHTML = ""
  window.api.send("getMessageReq", {login, password, path, uid})
}