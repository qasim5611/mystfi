// Require the necessary discord.js classes
const {
  Client,
  Events,
  GatewayIntentBits,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
} = require("discord.js");
const Discord = require("discord.js");

const { token } = require("./config.json");
const { setUser } = require("./controllers/Controller");

const express = require("express");
const cors = require("cors");

const Routes = require("./routes/Routers");
const { request } = require("express");

const app = express();
const PORT = 8080;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use((req, res, next) => {
  res.locals.path = req.path;
  next();
});

app.use(express.static("./build"));

// routes
app.use("/api", Routes);
const data = {};

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// Log in to Discord with your client's token
client.login(token);

const init = () => {
  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId("primary").setLabel("HERE").setStyle(1)
  );
  client.channels.cache
    .get("1051214672356966401")
    .send({ content: "Verify Your Wallet", components: [row] });
};

client.once(Events.ClientReady, (c) => {
  console.log(`Ready! Logged in as ${c.user.tag}`);
});

client.on("ready", () => {
  console.log("Bot Ready!");
  init();
});

client.on("interactionCreate", async (interaction) => {
  try {
    if (interaction.isButton()) {
      const exampleEmbed = new EmbedBuilder()
        .setTitle("Verification")
        .setURL("https://verify.myst.fi/")
        .setDescription("click Verification to connect wallet")
        .addFields(
          { name: "👾-tier-3", value: "balance from 500000 to 2500000" },
          { name: "🤠-tier-4", value: "balance from 2500000 to 15000000" },
          { name: "🐳-tier-5", value: "more than 15000000" }
        )
        .setColor("Yellow");
      interaction.reply({ embeds: [exampleEmbed], ephemeral: true });
      setUser(interaction.member);
    }
  } catch (e) {
    console.error(e);
  }
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}...`));

// When the client is ready, run this code (only once)
// We use 'c' for the event parameter to keep it separate from the already defined 'client'
