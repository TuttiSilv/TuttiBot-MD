const start = require('./start')
const {get} = require('./lib/function')
const fs = require('fs')

const inicio = async () => {
    tutti = await start()
	tutti.ev.on('messages.upsert', async m => {
		try {
	const prefix = '/'
	const mek = m.messages[0]
	const from = mek.key.remoteJid
	await tutti.sendReadReceipt(mek.key.remoteJid, mek.key.participant, [mek.key.id])
	if (!mek.key.participant) mek.key.participant = mek.key.remoteJid
	mek.key.participant = mek.key.participant.replace(/:[0-9]+/gi, "")
	if (!mek.message) return
	const type = Object.keys(mek.message).find((key) => !['senderKeyDistributionMessage', 'messageContextInfo'].includes(key))
	const body = (type === 'conversation' &&
	mek.message.conversation.startsWith(prefix)) ?
	mek.message.conversation: (type == 'imageMessage') &&
	mek.message[type].caption.startsWith(prefix) ?
	mek.message[type].caption: (type == 'videoMessage') &&
	mek.message[type].caption.startsWith(prefix) ?
	mek.message[type].caption: (type == 'extendedTextMessage') &&
	mek.message[type].text.startsWith(prefix) ?
	mek.message[type].text: (type == 'listResponseMessage') &&
	mek.message[type].singleSelectReply.selectedRowId ?
	mek.message.listResponseMessage.singleSelectReply.selectedRowId: (type == 'templateButtonReplyMessage') ?
	mek.message.templateButtonReplyMessage.selectedId: (type === 'messageContextInfo') ?
	mek.message[type].singleSelectReply.selectedRowId: (type == 'tutti.sendMessageButtonMessage') &&
	mek.message[type].selectedButtonId ?
	mek.message[type].selectedButtonId: (type == 'stickerMessage') && ((mek.message[type].fileSha256.toString('base64')) !== null && (mek.message[type].fileSha256.toString('base64')) !== undefined) ? (mek.message[type].fileSha256.toString('base64')): ""
	budy = (type === 'conversation') ? mek.message.conversation : (type === 'extendedTextMessage') ? mek.message.extendedTextMessage.text : ''
	const comando = body.slice(1).trim().split(/ +/).shift().toLowerCase()
	const pushname = mek.pushName ? mek.pushName : ""
	const args = body.trim().split(/ +/).slice(1)
	const enviar = (async (msg) =>{
		tutti.sendMessage(from,{ text: msg },{quoted:mek})
	})
	switch (comando) {
		case 'texto':
			enviar(`Ola, ${pushname}.`)
			break;
			case 'imagem':
				a = await get(`https://i.imgur.com/7VL9cFf.jpg`)
				tutti.sendMessage(from,{image:a,caption:`teste`})
				break;
		default:
			break;
	}
		} catch (e) {
			console.log(e);
		}
	})
}
inicio()


