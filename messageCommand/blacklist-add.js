const { PermissionsBitField } = require("discord.js");
const { prefix } = require("../config.js");
const fs = require("fs");
const path = require("path");

module.exports = {
    name: "blacklist-add",
    async execute(message, args, client) {

        if (!message.member.permissions.has(PermissionsBitField.Flags.ManageGuild)) {
      return message.reply({ content: ":x: You do not have the necessary permissions to use this command.", ephemeral: true });
    }
        
        let user = message.mentions.users.first();
        let reason = message.content.split(" ").slice(2).join(" ") || "no reason";

        if (!user) {
            return message.reply(`${prefix}blacklist-add [mention] [reason & without reason]`);
        }

        const blacklistFilePath = path.join('blacklist.json');

        if (!fs.existsSync(blacklistFilePath)) {
            return message.reply("The blacklist file does not exist.");
        }

        let blacklistData = JSON.parse(fs.readFileSync(blacklistFilePath));

        const roleId = blacklistData[message.guild.id];
        if (!roleId) {
            return message.reply("No role is saved for this server in the blacklist.");
        }

        const role = message.guild.roles.cache.get(roleId);
        if (!role) {
            return message.reply("The saved role no longer exists on the server.");
        }

        try {
                    await message.guild.members.fetch(user.id);
            const member = message.guild.members.cache.get(user.id);


            await member.roles.add(role);
            message.reply(`${user.username} has been blacklisted`);
            user.send({ content: `You are registered on the blacklist\nReason: ${reason}`})
        } catch (error) {
            message.reply("An error occurred while assigning the role.");
            console.error(error);
        }
    },
};
