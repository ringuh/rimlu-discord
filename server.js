const Discord = require('discord.js');
const fs = require('fs');
const { prefix, discord_token } = require('./config.json');
const path = require('path')
global.appRoot = path.resolve(__dirname);

const client = new Discord.Client();
client.commands = new Discord.Collection();

//const database = require('./funcs/database')
//database.connection()
const db = require('./models')
const streams = require('./funcs/streams')



const loadCommands = (fPath) => {
            
	const folders = fs.readdirSync(fPath, { withFileTypes: true }).filter(file => file.isDirectory());
	const commandFiles = fs.readdirSync(fPath, { withFileTypes: true }).filter(file => file.name.endsWith('.js'));
	
	for (const file of commandFiles) {
		const command = require(path.join(fPath, file.name));
		command.name.forEach(al => client.commands.set(al, command))
	}

	folders.forEach(folder => {
		loadCommands(require('path').join(fPath, folder.name))
	})
	
	
};

loadCommands(path.join(appRoot, "commands"))


client.once('ready', () => {
	console.log('Discord bot running!');
	streams.init(client)
});

client.on('message', message => {
	if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).split(/ +/);
	const command = args.shift().toLowerCase();

	if (!client.commands.has(command)) return;

	

	try {
		client.commands.get(command).execute(message, args);
	} catch (error) {
		console.error(error);
		message.reply('there was an error trying to execute that command!');
	}
});

client.login(discord_token);


