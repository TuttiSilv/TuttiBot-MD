const {default: makeWASocket, DisconnectReason, makeInMemoryStore, useSingleFileAuthState} = require('@adiwajshing/baileys')
const P = require('pino')
const store = makeInMemoryStore({ logger: P().child({ level: 'debug', stream: 'store' }) })
store.readFromFile('./store.json')
setInterval(() => {
    store.writeToFile('./store.json')
}, 10000)
const {state, saveState} = useSingleFileAuthState('./tutti.json')
const start = async () => {
	try{
		const tutti = makeWASocket({
			logger: P({ level: 'silent' }),
            printQRInTerminal: true,
			auth: state,
		})
		store.bind(tutti.ev)
		tutti.ev.on('connection.update', (update) => {
			const { connection, lastDisconnect } = update
			if(connection === 'close') {
				if((lastDisconnect.error)?.output?.statusCode !== DisconnectReason.loggedOut) {
					start()
				} else {
					console.log('Tentando reconectar......')
				}
			}
			console.log('atualizando....', update)
		})
       

		tutti.ev.on('creds.update', saveState)
		return tutti
	} catch (e){
		console.log(e)
	}
}
module.exports = start

