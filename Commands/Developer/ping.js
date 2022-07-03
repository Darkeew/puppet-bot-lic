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
        const SettingsModel = require('../../Structures/Schema/Settings.js')
        const is_blacklisted = await SettingsModel.findOne({channel: interaction.channel.id})
        if(is_blacklisted !== null){
            if(!is_blacklisted.blacklist.allowedchannels.commands.includes(`ping`)){
                return interaction.reply({embeds: [
                    new MessageEmbed()
                    .setDescription(`This command has been disabled in this channel.`)
                ], ephemeral: true})
            }
        } else if (is_blacklisted === null){
            return interaction.reply({embeds: [
                new MessageEmbed()
                .setDescription(`This command has been disabled in this channel.`)
            ], ephemeral: true})
        }
        interaction.reply({embeds:[
            new MessageEmbed()
            .setColor(`DARK_GOLD`)
            .setAuthor({name: `${interaction.member.user.tag}`, iconURL: `${interaction.member.user.avatarURL()}`})
            .setDescription(`Pong! 🏓 The current ping is \`\`${client.ws.ping}\`\`ms!`)
            .setTimestamp()
        ]})
    }
}

