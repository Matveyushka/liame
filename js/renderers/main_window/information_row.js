const inforow = document.getElementById("information-row")

export const infoLoaderOn = () => {
  inforow.innerHTML = ""
  const loader = document.createElement("div")
  loader.classList.add("info-loader")
  inforow.append(loader)
}

export const infoLoaderOff = (message) => {
  inforow.innerHTML = ""
  if (message !== undefined) inforow.innerText = message
}

export const infoShow = (msg) => {
  inforow.innerText = msg
}