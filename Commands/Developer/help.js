const { CommandInteraction, MessageEmbed } = require("discord.js");

module.exports = {
    name: 'help',
    description: 'Shows all the commands and their use.',
    permission: 'SEND_MESSAGES',
    options: [{
        name: `shop`,
        description: 'Shows commands related to the shop command.',
        type: `SUB_COMMAND`
    },
    {
        name: `balance`,
        description: 'Shows commands related to the balance command.',
        type: `SUB_COMMAND`
    },
    {
        name: `economy`,
        description: `Shows the commands related to economy.`,
        type: `SUB_COMMAND`
    },
    {
        name: `others`,
        description: `Shows commands related to other things.`,
        type: `SUB_COMMAND`
    },
    ],
    /**
     * @param {CommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {
        if(interaction.toString() === `/help shop`){
        interaction.reply({embeds:[
            new MessageEmbed()
            .setColor(`DARK_GOLD`)
            .setAuthor({name: `${interaction.member.user.tag}`, iconURL: `${interaction.member.user.avatarURL()}`})
            .setDescription(`
Welcome to the help command! Here you can see the shop commands and their use.

**/shop view** 
 >> View what is in the shop and its price and description.
**/shop buy \`[item]\`**
 >> Buy an item from the shop.
**/shop add-item \`[name] [description] [price] [role]\`**
 >> Adds an item to the shop with the provided values. **(Admin Only)**
**/shop remove-item \`[item]\`**
 >> Removes the specified item from the shop. **(Admin Only)**
            `)
            .setTimestamp()
        ]})
        } else if (interaction.toString() === `/help balance`){
            interaction.reply({embeds:[
                new MessageEmbed()
                .setColor(`DARK_GOLD`)
                .setAuthor({name: `${interaction.member.user.tag}`, iconURL: `${interaction.member.user.avatarURL()}`})
                .setDescription(`
Welcome to the help command! Here you can see the balance commands and their use.

**/balance view**
 >> View your current balance, and others people balance. Maybe checking their balance will hide your pain from being poor. 
**/balance give-coins \`[user] [amount]\`**
 >> Give the provided coins to the provided user. **(Staff Only)**
**/balance remove-coins \`[user] [amount]\`**
  >> Remove the provided coins from the provided user. **(Staff Only)**
                `)
                .setTimestamp()
            ]})
        } else if (interaction.toString() === `/help economy`){
            interaction.reply({embeds:[
                new MessageEmbed()
                .setColor(`DARK_GOLD`)
                .setAuthor({name: `${interaction.member.user.tag}`, iconURL: `${interaction.member.user.avatarURL()}`})
                .setDescription(`
Welcome to the help command! Here you can see the economy commands and their use.

**/daily**
 >> Claim your daily, it gives **50** tedollars and a bonus based on your streak. (10 tedollars per day)
**/ask** 
 >> Ask the damned cat for forgiveness and tedollars, and hope for a response. Good luck to not be caught by the rat.
**/claim-reward \`[level]\`**
 >> Claim a reward for leveling up. The following levels award you with coins: Level 5, Level 10, Level 20, Level 30, Level 40, Level 50, Level 75 and Level 100.
                `)
                .setTimestamp()
            ]})
        } else {
            interaction.reply({embeds:[
                new MessageEmbed()
                .setColor(`DARK_GOLD`)
                .setAuthor({name: `${interaction.member.user.tag}`, iconURL: `${interaction.member.user.avatarURL()}`})
                .setDescription(`
Welcome to the help command! Here you can see other commands and their use.

**/help [command]**
 >> Shows all the commands available on the module and their use.
**/ping** 
 >> Shows the current latency of the bot.
**/staff-list**
 >> Shows all staff members and their position. It also shows if they are online, occupied, offline or idle.
                `)
                .setTimestamp()
            ]})
        }
    }
}

