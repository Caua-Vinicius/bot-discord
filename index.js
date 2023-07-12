// Require the necessary discord.js classes
const { Client, Events, GatewayIntentBits, Collection } = require('discord.js');

const dotenv =require('dotenv')
dotenv.config()
const {TOKEN, CLIENT_ID, GUILD_ID} = process.env

//Importação dos comandos
const fs =  require('node:fs')
const path = require('node:path')

const commandsPath = path.join(__dirname, 'commands')
const commandsFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'))

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.commands = new Collection

for (const file of commandsFiles){
    const filepath = path.join(commandsPath, file)
    const command = require(filepath)
    if ("data" in command && "execute" in command){
        client.commands.set(command.data.name, command)
    }else{
        console.log(`Esse comando ${filepath} está com data ou com execute ausentes`)
    }
}


// When the client is ready, run this code (only once)
// We use 'c' for the event parameter to keep it separate from the already defined 'client'
client.once(Events.ClientReady, c => {
	console.log(`Ready! Logged in as ${c.user.tag}`);
});

// Log in to Discord with your client's token
client.login(TOKEN);

//Listenter de interações
client.on(Events.InteractionCreate, async interaction =>{
    if (!interaction.isChatInputCommand()) return
    console.log(interaction)
    const command = interaction.client.commands.get(interaction.commandName)
    if (!command){
        console.error("Comando não encontrado")
        return

    }
    try {
        await command.execute(interaction)
    } catch (error){
        console.error(error)
        await interaction.reply("Teve um erro inesperado")
    }
})