import "../common.js" 

const getCategoryAlias = (name) => {
  if (name === "INBOX") return "Входящие"
  else return name
}

const addCategoryButton = (name, path) => {
  const buttonArea = document.getElementById("mailbox-categories")

  const newButton = document.createElement("div")
  newButton.classList.add("button")
  newButton.innerText = getCategoryAlias(name)

  buttonArea.appendChild(newButton)
}

window.api.receive("messagesResponce", messages => {
  messages.forEach(message => console.log())
})

window.api.receive("mainwindowOnStartResponse", data => {
  data.mailboxes.children.forEach(mailbox => {
    addCategoryButton(mailbox.name)
  });

  window.api.send("messagesQuery", { 
    login: data.login,
    password: data.password,
    path: "INBOX",
    begin: 1,
    end: 20,
   })
})

window.api.send("mainwindowOnStart")


