// index.js
const { Client, GatewayIntentBits } = require('discord.js');
const Agario = require('agario-client'); // librería ejemplo hipotética
require('dotenv').config();

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
});

let bots = [];
const BOT_COUNT = parseInt(process.env.BOT_COUNT) || 1;

// Funciones para crear y manejar bots
async function connectBots(partyId, region) {
  bots.forEach(b => b.disconnect());
  bots = [];

  for (let i = 0; i < BOT_COUNT; i++) {
    const bot = new Agario.Bot({ region });
    await bot.connect(partyId);
    bots.push(bot);
  }
}

function feedBots() {
  bots.forEach(b => b.feed());
}

function splitBots() {
  bots.forEach(b => b.split());
}

function stopBots() {
  bots.forEach(b => b.disconnect());
  bots = [];
}

// Discord
client.on('ready', () => console.log(`Bot Discord listo: ${client.user.tag}`));
client.on('messageCreate', async msg => {
  if (!msg.content.startsWith('!') || msg.author.bot) return;

  const [cmd, arg1, arg2] = msg.content.split(' ');
  if (cmd === '!join') {
    await connectBots(arg1, arg2.toLowerCase());
    msg.reply('Bots conectados a la party!');
  }
  if (cmd === '!feed') { feedBots(); msg.reply('Bots alimentados 🪱'); }
  if (cmd === '!split') { splitBots(); msg.reply('Bots divididos ✂️'); }
  if (cmd === '!stop') { stopBots(); msg.reply('Bots detenidos ❌'); }
});

client.login(process.env.DISCORD_TOKEN);
