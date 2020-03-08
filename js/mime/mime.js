export const mimeToHtml = (mimeBody) => {
  return parseNode(mimeBody)
}

const newAttachment = (description, attachment) => {
  const att = document.createElement("div")
  att.classList.add("attachment")

  const divider = document.createElement("div")
  divider.classList.add("divider")

  const label = document.createElement("div")
  label.classList.add("label")
  label.innerText = description

  att.append(divider)
  att.append(label)
  att.append(attachment)

  return att
}

const parseNode = (node) => {
  const nodeHtml = document.createElement("div")

  console.log(node)

  if (/multipart/.test(node.contentType.value)) {
    nodeHtml.classList.add("letter-content")
    node.childNodes.forEach(subNode => {
      nodeHtml.append(parseNode(subNode))
    })
  } else {
    if (node.contentType.value === "text/plain") {
      nodeHtml.innerText = parseUTF8Text(node.content)
    } else if (/image/.test(node.contentType.value)) {
      nodeHtml.append(newAttachment("graphic attachment: ", parseImageBase64(node.content)))
    } else if (/audio/.test(node.contentType.value)) {
      nodeHtml.append(newAttachment("audio attachment: ", parseAudioMpegBase64(node.content)))
    }
  }
  return nodeHtml
}

const parseUTF8Text = (text) => new TextDecoder("utf-8").decode(text)

const parseImageBase64 = (content) => {
  const img = document.createElement("img")
  const base64 = toBase64(content)
  img.src = "data:image/png;base64," + base64
  return img
}

const parseAudioMpegBase64 = (content) => {
  const audio = document.createElement("audio")
  audio.controls = true
  const base64 = toBase64(content)
  audio.src = "data:audio/mp3;base64," + base64
  return audio
}

const toBase64 = function (u8) {
  return btoa(new Uint8Array(u8).reduce(function (data, byte) {
    return data + String.fromCharCode(byte);
  }, ''));
}