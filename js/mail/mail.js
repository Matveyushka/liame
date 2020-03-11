const simpleParser = require('mailparser').simpleParser

const Imap = require('./imap')
const nodemailer = require("nodemailer")

const sendMail = async (login, password, to, subject, text, attachments) => {
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
    from: '"' + login + '" <' + login + '>',
    to: to.toString(),
    subject,
    text,
    attachments
  }

  return await transporter.sendMail(sentObject)
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
    return { info: message.envelope ,body: await simpleParser(message['body[]'])}
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

const markAsRead = async (login, password, path, sequence) => {
  try {
    return await Imap.markAsRead(login, password, path, sequence)
  } catch (error) {
    return error
  }
}

const getMailboxSize = async (login, password, path) => {
  try {
    return (await Imap.selectMailbox(login, password, path)).exists
  } catch (error) {
    return error
  }
}

const deleteMessages = async (login, password, path, sequence) => {
  try {
    return await Imap.deleteMessages(login, password, path, sequence)
  } catch (error) {
    return error
  }
}

module.exports = {
  sendMail,
  getMailboxes,
  getMessage,
  getMessagesInfo,
  getMailboxSize,
  deleteMessages,
  markAsRead
}