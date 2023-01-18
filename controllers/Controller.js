const { Client, GatewayIntentBits } = require("discord.js");
const Web3 = require("web3");
const { token } = require("../config.json");
const tokenAbi = require("../abis/TokenAbi.json");
const stakingAbi = require("../abis/StakingAbi.json");
const tokenAddress = "0x2BB7De3e633293F03760aaF087b7823751a4C9B4";
const StakingAddress = "0xC302fFda1A64a2339A1720F0E238349F3c941E12";
let curUser = null;

const setUser = (userData) => {
  curUser = userData;
};

const calcBalance = async (wAddress) => {
  const web3 = new Web3("https://bsc-dataseed1.binance.org");

  let tokenContract = await new web3.eth.Contract(tokenAbi, tokenAddress);
  let stakingContract = await new web3.eth.Contract(stakingAbi, StakingAddress);

  let tokenBalance = await tokenContract.methods.balanceOf(wAddress).call();
  let stakingBalance = await stakingContract.methods
    .stakeInfos(wAddress)
    .call();

  const temp = 10 ** 18;

  return tokenBalance / temp + stakingBalance.totalStaked / temp;
};

const connect = async (req, res) => {
  let { walletAddress } = req.body;
  //console.log("address:", walletAddress);
  //console.log("info:", curUser);

  const client = new Client({ intents: [GatewayIntentBits.Guilds] });
  client.login(token);

  var tokenAmount = await calcBalance(walletAddress);

  if (tokenAmount >= 500000 && tokenAmount < 2500000)
    curUser.roles.add("1050233009275674725");
  else if (tokenAmount >= 2500000 && tokenAmount < 15000000)
    curUser.roles.add("1050233035708186684");
  else if (tokenAmount >= 15000000) curUser.roles.add("1050233147633172562");

  // client.on("ready", async () => {
  //   const verifyChannel = client.channels.cache.get("1051214672356966401");

  //   verifyChannel.send(
  //     curUser.user.username + "#" + curUser.user.discriminator + " verified"
  //   );
  // });
  return res.send();
};

module.exports = {
  connect,
  setUser,
};
