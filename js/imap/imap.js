const ImapClient = require('emailjs-imap-client').default

const getClient = async (login, password) => {
  const client = new ImapClient("imap.mail.ru", 993, {
    auth: {
      user: login,
      pass: password
    }
  })

  client.onerror = (error) => console.log(error)

  await client.connect()

  return client
}

const getMailboxes = async (login, password) => {
  try {
    const client = await getClient(login, password)
    return await client.listMailboxes()
  }
  catch (error) {
    return error
  }
}

const getMessages = async (login, password, path, begin, end) => {
  try {
    const client = await getClient(login, password)
    return await client.listMessages(path, `${begin}:${end}`, ['uid', 'flags', 'body[]'])
  }
  catch (error) {
    return error
  }
}

module.exports = {
  getMailboxes,
  getMessages
}