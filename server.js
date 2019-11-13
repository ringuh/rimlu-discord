global.config = require('./config.json');
const { prefix, discord_token, bypass_bots } = global.config;
Object.keys(global.config.numerics).forEach(k => {
	if (k.endsWith("_seconds")) global.config.numerics[k] *= 1000
	else if (k.endsWith("_minutes")) global.config.numerics[k] *= 60 * 1000
	else if (k.endsWith("_hours")) global.config.numerics[k] *= 60 * 60 * 1000
	else if (k.endsWith("_days")) global.config.numerics[k] *= 24 * 60 * 60 * 1000
})

const Discord = require('discord.js');
const fs = require('fs');
const { botPermission } = require('./funcs/commandTools');
const path = require('path')

const client = new Discord.Client();
client.commands = new Discord.Collection();



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
loadCommands(path.join(__dirname, "commands"))


client.once('ready', () => {
	console.log('Discord bot running!');
	client.user.setActivity("!commands", { type: "LISTENING" });
	streams.init(client)
});

client.on('message', message => {

	// ignore non-prefix and other bots excluding REPEAT BOT 621467973122654238
	if (!message.content.startsWith(prefix) ||
		(message.author.bot && !bypass_bots.includes(message.author.id))
	) return true;

	// mobile discord wants to offer ! command instead of !command
	if (message.content.startsWith(`${prefix} `))
		message.content = message.content.replace(`${prefix} `, prefix)

	let args = message.content.slice(prefix.length).split(/ +/);
	let parameters = []
	if (args.includes("|"))
		parameters = args.splice(args.indexOf("|"), args.length).slice(1)
	const command = args.shift().toLowerCase();
	if (!client.commands.has(command)) return;

	try {
		let cmd = client.commands.get(command)
		if (botPermission(message, cmd.permissions))
			cmd.execute(message, args, parameters);
	} catch (error) {
		console.error(error.message);
		message.reply(error.message);
	}
});

client.login(discord_token);


