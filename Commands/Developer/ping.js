const { CommandInteraction, MessageEmbed } = require("discord.js");

module.exports = {
    name: 'ping',
    description: 'Gives the current latency of the bot.',
    permission: 'SEND_MESSAGES',
    /**
     * @param {CommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {
        interaction.reply({embeds:[
            new MessageEmbed()
            .setColor(`DARK_GOLD`)
            .setAuthor({name: `${interaction.member.user.tag}`, iconURL: `${interaction.member.user.avatarURL()}`})
            .setDescription(`Pong! 🏓 The current ping is \`\`${client.ws.ping}\`\`ms!`)
            .setTimestamp()
        ]})
    }
}

