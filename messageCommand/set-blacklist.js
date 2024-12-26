const { PermissionsBitField } = require("discord.js");
const { prefix } = require("../config.js");
const fs = require("fs");
const path = require("path");

module.exports = {
    name: "set-blacklist",
    async execute(message, args, client) {

        if (!message.member.permissions.has(PermissionsBitField.Flags.ManageGuild)) {
      return message.reply({ content: ":x: You do not have the necessary permissions to use this command.", ephemeral: true });
    }
        
        let role = message.mentions.roles.first();
        
        if (!role) {
            return message.reply(`${prefix}set-blacklist [mention role]`);
        }

        const blacklistFilePath = path.join('blacklist.json');
        let blacklistData = {};

        if (fs.existsSync(blacklistFilePath)) {
            blacklistData = JSON.parse(fs.readFileSync(blacklistFilePath));
        }

        if (!blacklistData[message.guild.id]) {
            blacklistData[message.guild.id] = role.id;
            fs.writeFileSync(blacklistFilePath, JSON.stringify(blacklistData, null, 4));
            return message.reply(`The role has been save successfully.`);
        } else {
            return message.reply(`The role is has already saved.`);
        }
    },
};
