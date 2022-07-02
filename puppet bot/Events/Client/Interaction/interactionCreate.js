const { Client, CommandInteraction, MessageEmbed } = require("discord.js");
const commands = require("../../../Structures/Handlers/Commands");

module.exports = {
    name: 'interactionCreate',
    /**
     * 
     * @param {CommandInteraction} interaction 
     * @param {Client} client 
     */
    async execute(interaction, client) {
        if(interaction.isCommand()) {
            const command = client.commands.get(interaction.commandName)
            if(!command) return interaction.reply({embeds: [
                new MessageEmbed()
                .setColor('RED')
                .setDescription('An error occurred while running this command.')
            ]}) && client.commands.delete(interaction.commandName)
            if (command.permission && !interaction.member.permissions.has(command.permission)) {
                return interaction.reply({ content: `You do not have the required permission for this command: \`${interaction.commandName}\`.`, ephemeral: true })
            }
            command.execute(interaction, client)

        }
    }
}