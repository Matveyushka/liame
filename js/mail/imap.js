const ImapClient = require('emailjs-imap-client').default

const getClient = async (login, password) => {
  const client = new ImapClient("imap.mail.ru", 993, {
    auth: {
      user: login,
      pass: password
    }
  })

  await client.connect()

  return client
}

const getMailboxes = async (login, password) => await
  (await getClient(login, password))
    .listMailboxes()

const selectMailbox = async (login, password, path) => await
  (await getClient(login, password))
    .selectMailbox(path)

const getMessage = async (login, password, path, uid) => (await (await getClient(login, password))
  .listMessages(path, `${uid}`, ['uid', 'flags', 'envelope', 'body[]'], { byUid: true }))[0]

const getMessagesInfo = async (login, password, path, begin, end) => await
  (await getClient(login, password))
    .listMessages(path, `${begin}:${end}`, ['uid', 'flags', 'envelope'])

const deleteMessages = async (login, password, path, sequence) => await
  (await getClient(login, password)).deleteMessages(path, sequence, { byUid: true })

const markAsRead = async (login, password, path, sequence) => {
  return await (await getClient(login, password)).setFlags(
    path,
    sequence,
    { set: ['\\Seen'], add: ['\\Seen'], remove: ['\\Unseen'] },
    { byUid: true }
  )
}

module.exports = {
  getMailboxes,
  getMessage,
  getMessagesInfo,
  selectMailbox,
  deleteMessages,
  markAsRead
}