const { Client, Collection } = require("discord.js");
const { readdirSync } = require("fs");
const colors = require("colors");

class Bot extends Client {
    constructor(options) {
        super(options);

        this.validate(options);

        this.commands = new Collection();
        this.aliases = new Collection();
        this.cachedUsers = [];
    }

    async initialize(token = this.token) {
        const events = readdirSync("src/events/");
        events.forEach((file) => {
            if (!file.endsWith(".js")) return;

            try {
                const path = `./events/${file}`;
                const archive = require(path);
                delete require.cache[require.resolve(path)];

                this.on(archive.event, (...args) => archive.run(this, ...args));
            } catch (err) {
                console.log(`An error occurred loading the event file ${file}`);
                console.log(colors.red(err));
            }
        });
        console.clear()
        console.log(`${colors.yellow('DEBUG')} | ${colors.magenta('Starting...')}`);
        await this.login(token);
    }

    validate(options) {
        if (!options.token) {
            throw new Error("The client needs a token");
        }

        if (typeof options.token !== "string") {
            throw new TypeError("The token must be of type string");
        }

        this.token = options.token;
        this.prefix = options.prefix || ".";
    }
}

module.exports = Bot;