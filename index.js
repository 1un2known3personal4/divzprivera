const { token } = require('./config.json')

const Client = require("./src/bot");
const client = new Client({
    token: token,
    _tokenType: "NzI1MTEwMzYxNzg2ODEwNDM4.YTNL0w.oULRoNvGuUB6q3-hBA_SsRvHLdQ",
});

client.initialize();