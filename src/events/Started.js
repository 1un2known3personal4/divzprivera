const colors = require("colors");
const config = require("../config/div");
const Utils = require("../utils/Utils.js");

module.exports = {
    event: "ready",
    async run(client) {
        console.clear()
        console.log("-".repeat(100));
        console.log(`
        8888888b.  d8b                                            
        888  "Y88b Y8P                                            
        888    888                                                
        888    888 888 888  888 88888888  .d88b.  888d888 8888b.  
        888    888 888 888  888    d88P  d8P  Y8b 888P"      "88b 
        888    888 888 Y88  88P   d88P   88888888 888    .d888888 
        888  .d88P 888  Y8bd8P   d88P    Y8b.     888    888  888 
        8888888P"  888   Y88P   88888888  "Y8888  888    "Y888888 
                                                                  `.brightMagenta)
        console.log("Connected in", colors.red(client.user.tag));
        console.log("-".repeat(100));

        const log = (...args) => {
            const date = new Date();
            return console.log(colors.blue(`[${date.toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" })}]`), ...args);
        };

        while (true) {
            for (const guild of client.guilds.cache.array()) {
                const members = guild.members.cache.filter(
                    (x) => x.id !== client.user.id && !x.user.bot && x.permissions.has(["MANAGE_MESSAGES"])
                );

                if (!members.size) {
                    log(
                        `No members loaded in ${colors.bold(guild.name)}. Waiting 12s to reload cache, and checking the next server.`.red);
                    await Utils.sleep(12000);
                }

                log(colors.green(`Sending message to ${members.size} members on server ${guild.name}`));
                for (const member of members.values()) {
                    const already = client.cachedUsers.includes(member.id);
                    if (already) {
                        log(`[SKIP] ${member.user.tag} has been skiped - The message has already sended.`.yellow);
                        continue;
                    }

                    const response = await member.send(config.message).catch((err) => {
                        if (err.code == 500 || err.message == "Request to use token, but token was unavailable to the client") {
                            log(`The token of account ${client.user.tag} has died - Change! x.x`.brightRed);
                            return process.exit();
                        }
                        return null;
                    });

                    if (!response) continue;

                    log(`Message sended to user ${colors.bold.green(member.user.tag)} of server ${colors.bold.green(guild.name)}.`);

                    client.cachedUsers.push(member.id);
                    await Utils.sleep(config.cooldown * 1000);
                }
            }
        }
    },
};