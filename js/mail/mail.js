const parse = require('emailjs-mime-parser').default

const Imap = require('./imap')
const nodemailer = require("nodemailer")

const sendMail = async (login, password, to, subject, text, attachments) => {
  console.log("SENDING...")

  const transporter = nodemailer.createTransport({
    host: "smtp.mail.ru",
    port: 465 ,
    secure: true,
    auth: {
      user: login,
      pass: password
    }
  })

  const sentObject = {
    from: '"Matveika" <' + login + '>', // sender address
    to: to.toString(), // list of receivers
    subject, // Subject line
    text, // plain text body
    attachments // html body
  }

  console.log(sentObject)

  let info = await transporter.sendMail(sentObject);
}

const getMailboxes = async (login, password) => {
  try {
    const imapMailboxes = await Imap.getMailboxes(login, password)
    const mailboxes = imapMailboxes.children.map(mailbox => ({
      name: mailbox.name,
      path: mailbox.path
    }))
    return mailboxes
  } catch (error) {
    return error
  }
}

const getMessage = async (login, password, boxPath, uid) => {
  try {
    const message = await Imap.getMessage(login, password, boxPath, uid)
    return { info: message.envelope ,body: parse(message['body[]'])}
  } catch (error) {
    return error
  }
}

const getMessagesInfo = async (login, password, boxPath, rangeBegin, rangeEnd) => {
  try {
    return await Imap.getMessagesInfo(login, password, boxPath, rangeBegin, rangeEnd)
  } catch (error) {
    return error
  }
}

const getMailboxSize = async (login, password, path) => (await 
  Imap.selectMailbox(login, password, path)).exists

const deleteMessages = async (login, password, path, sequence) => await
  Imap.deleteMessages(login, password, path, sequence)

module.exports = {
  sendMail,
  getMailboxes,
  getMessage,
  getMessagesInfo,
  getMailboxSize,
  deleteMessages
}