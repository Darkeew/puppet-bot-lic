const { CommandInteraction, MessageEmbed } = require("discord.js");

module.exports = {
    name: 'settings',
    description: 'Change the settings you want.',
    permission: 'SEND_MESSAGES',
    options: [{
        name: `allowed-channels`,
        description: `Add or view allowed channels.`,
        type: 'SUB_COMMAND',
        options:[{
            name: `add-channel`,
            description: `The channel to allow.`,
            type: `CHANNEL`,
            channelTypes: [`GUILD_TEXT`],
            required: false
        },
        {
            name: `remove-channel`,
            description: `The channel to remove.`,
            type: `CHANNEL`,
            channelTypes: [`GUILD_TEXT`],
            required: false
        }
    ],
    },
    {
        name: `view-allowed-channels`,
        description: `View all allowed channels, if there are any.`,
        type: `SUB_COMMAND`
    },
    {
        name: `view-allowed-commands`,
        description: `View all allowed commands in a certain channel, if there are any.`,
        type: `SUB_COMMAND`,
        options: [{
            name: `channel`,
            description: `The channel to view allowed commands.`,
            type: `CHANNEL`,
            channelTypes: [`GUILD_TEXT`],
            required: true
        }]
    },
    {
        name: `allowed-commands`,
        description: `Allow a command to be executed in the channel selected.`,
        type: 'SUB_COMMAND',
        options:[{
            name:`channel`,
            description: `The selected channel to add/remove commands.`,
            type:`CHANNEL`,
            channelTypes: [`GUILD_TEXT`],
            required: true
        },
        {
            name: `add-command`,
            description: `The command to add.`,
            type: `STRING`,
            required: false
        },
        {
            name:`remove-command`,
            description: `The command to remove`,
            type: `STRING`,
            required: false
        }
    ],
    }
],
    /**
     * @param {CommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {
        const SettingsModel = require(`../../Structures/Schema/Settings`)

        const command_array = [`ask`,`balance`,`claim-reward`,`daily`,`help`,`ping`,`shop`,`staff-list`,`leaderboard`,`hug`]

       //const member = await interaction.guild.members.fetch(interaction.user.id)
       //if(!member.roles.cache.has(`970229987405877259`)){
       //    return interaction.reply({embeds: [
       //        new MessageEmbed()
       //        .setAuthor({name: `Missing permissions`})
       //        .setDescription(`You dont have enough permissions to run this command!`)
       //    ]})
       //}
        if(interaction.toString().includes(`/settings allowed-channels`)){
            const channel_to_add = interaction.options.getChannel(`add-channel`)
            const channel_to_remove = interaction.options.getChannel(`remove-channel`)
                if(channel_to_add !== null){
                    global.ding = 1
                } else {
                    global.ding = 0
                }if (channel_to_remove !== null){
                    global.dong = 1
                } else {
                    global.dong = 0
                }if(Math.floor(ding+dong) === 0){
                    return interaction.reply({embeds: [
                        new MessageEmbed()
                        .setAuthor({name:`Invalid Channel`})
                        .setDescription(`You didnt provide the setting you want to change!`)
                        .setColor(`DARK_GOLD`)
                        .setTimestamp()
                    ], ephemeral: true})
                }if (Math.floor(ding+dong) === 2){
                    return interaction.reply({embeds: [
                        new MessageEmbed()
                        .setAuthor({name:`Invalid Settings`})
                        .setDescription(`You cannot change two or more settings at the same time!`)
                        .setColor(`DARK_GOLD`)
                        .setTimestamp()
                    ], ephemeral: true})
                }
            if(interaction.toString().includes(`/settings allowed-channels add-channel`)){
                    const already_exists = await SettingsModel.findOne({channel: channel_to_add.id})
                    if(already_exists !== null) {
                       return interaction.reply({embeds: [
                            new MessageEmbed()
                            .setAuthor({name: `Already Added`})
                            .setDescription(`${channel_to_add} was already added to the allowed channels! To view all added channels, type \`/settings view-allowed-channels\`.`)
                            .setColor(`DARK_GOLD`)
                            .setTimestamp()
                        ]})
                    } else { 
                    interaction.reply({embeds: [
                       new MessageEmbed()
                       .setAuthor({name: `Added Channel`})
                       .setDescription(`Successfully added ${channel_to_add} to the allowed channels! **All commands** are allowed by default and you can change this with \`/settings allowed-commands\`.`)
                       .setColor(`DARK_GOLD`)
                       .setTimestamp()
                   ]})
                   await SettingsModel.create({channel: channel_to_add.id, blacklist: {allowedchannels: {channel: channel_to_add.id, commands: command_array}}})
                   return
                }
            } else if (interaction.toString().includes(`/settings allowed-channels remove-channel`)){
                const already_exists = await SettingsModel.findOne({channel: channel_to_remove.id})
                if (already_exists === null){
                    return interaction.reply({embeds: [
                        new MessageEmbed()
                        .setAuthor({name: `Channel Not Found`})
                        .setDescription(`${channel_to_remove} was not added to the allowed channels list yet! To view all added channels, type \`/settings view-allowed-channels\`.`)
                        .setColor(`DARK_GOLD`)
                        .setTimestamp()
                    ]})
                } else {
                    interaction.reply({embeds: [
                        new MessageEmbed()
                        .setAuthor({name: `Removed Channel`})
                        .setDescription(`Successfully removed ${channel_to_remove} from the allowed channels list. **All commands** will be ignored in that channel. You can view all allowed channels, type \`/settings view-allowed-channels\`.`)
                        .setColor(`DARK_GOLD`)
                        .setTimestamp()
                    ]})
                    await SettingsModel.deleteOne({channel: channel_to_remove.id})
                }
            }
        } else if (interaction.toString() === `/settings view-allowed-channels`){
            const allowed_channels = await SettingsModel.find({})
            if(allowed_channels.length === 0){
                return interaction.reply({embeds: [
                    new MessageEmbed()
                    .setAuthor({name: `No Channels Found`})
                    .setDescription(`There have been no allowed channels added. You can add one with \`/settings allowed-channels add-channel [channel]\`!`)
                    .setColor(`DARK_GOLD`)
                    .setTimestamp()
                    .setThumbnail(`https://d.furaffinity.net/art/vupiqueen/1655236864/1655236864.vupiqueen_fqx0vb5x0ain_mn.png`)
                ]})
            }
            const all_channels = allowed_channels
            .map((channels) => {
                  return `
> <#${channels.channel}>
                  `
            })
            const channels = all_channels.toString().replaceAll(`,`, ``)
            interaction.reply({embeds: [
                new MessageEmbed()
                .setAuthor({name: `Allowed Channels`})
                .setDescription(`
These are the allowed channels that have been added until now:
${channels}
                `)
                .setColor(`DARK_GOLD`)
                .setTimestamp()
                .setThumbnail(`https://d.furaffinity.net/art/vupiqueen/1655236864/1655236864.vupiqueen_fqx0vb5x0ain_mn.png`)
            ]})
        } else if (interaction.toString().includes(`/settings allowed-commands`)){
            const command_to_add = interaction.options.getString('add-command')
            const command_to_remove = interaction.options.getString(`remove-command`)
            const channel = interaction.options.getChannel(`channel`)
            const channel_exists = await SettingsModel.findOne({channel: channel.id})
            if(command_to_add !== null){
                global.ding = 1
            } else {
                global.ding = 0
            }
            if(command_to_remove !== null){
                global.dong = 1
            } else {
                global.dong = 0
            }
            if(Math.floor(ding+dong) === 0){
                return interaction.reply({embeds: [
                    new MessageEmbed()
                    .setAuthor({name:`Invalid Settings`})
                    .setDescription(`You didnt provide the setting you want to change!`)
                    .setColor(`DARK_GOLD`)
                    .setTimestamp()
                ], ephemeral: true})
            } else if (Math.floor(ding+dong) === 2){
                return interaction.reply({embeds: [
                    new MessageEmbed()
                    .setAuthor({name:`Invalid Settings`})
                    .setDescription(`You cannot change two or more settings at the same time!`)
                    .setColor(`DARK_GOLD`)
                    .setTimestamp()
                ], ephemeral: true})
            }
            if(interaction.toString().includes(`/settings allowed-commands channel:${channel.id} add-command`)){
                if(command_to_add.toLowerCase() !== `all`){
                if(!command_array.includes(command_to_add)){
                    return interaction.reply({embeds: [
                        new MessageEmbed()
                        .setAuthor({name:`Invalid Command`})
                        .setDescription(`'\`${command_to_add}\`' is not a valid command! The valid commands are: \`ask, balance, claim-reward, daily, help, ping, shop, staff-list, leaderboard, hug\` or you can type **All** to add all commands.`)
                        .setColor(`DARK_GOLD`)
                        .setTimestamp()
                    ]})
                }}
                if(!channel_exists){
                    return interaction.reply({embeds: [
                        new MessageEmbed()
                        .setAuthor({name:`Invalid Channel`})
                        .setDescription(`${channel} is not in the allowed channels list! You can add it with \`/settings allowed-channels add-channel [channel]\`, and see the added channels with \`/settings view-allowed-channels\`!`)
                        .setColor(`DARK_GOLD`)
                        .setTimestamp()
                    ]})
                } else if (command_to_add.toLowerCase() !== `all`){
                    if(channel_exists.blacklist.allowedchannels.commands.includes(command_to_add)){
                    return interaction.reply({embeds: [
                        new MessageEmbed()
                        .setAuthor({name:`Command Already Added`})
                        .setDescription(`'\`${command_to_add}\`' was already added to the allowed commands list! You can check the allowed commands with \`/settings view-allowed-commands [channel]\`!`)
                        .setColor(`DARK_GOLD`)
                        .setTimestamp()
                    ]})
                }
                }
                    if(command_to_add.toLowerCase() === `all`){
                        if(channel_exists.blacklist.allowedchannels.commands.length === 8){
                            return interaction.reply({embeds: [
                                new MessageEmbed()
                                .setDescription(`There are no commands to be added.`)
                            ], ephemeral: true})
                        }
                        if(channel_exists.blacklist.allowedchannels.commands.includes(`none`)){
                            await SettingsModel.updateOne({channel: channel.id}, {blacklist: {allowedchannels: {commands: []}}})
                        }
                        interaction.reply({embeds: [
                            new MessageEmbed()
                            .setAuthor({name:`Command Added`})
                            .setDescription(`Added **All commands** to the allowed commands list.`)
                            .setColor(`DARK_GOLD`)
                            .setTimestamp()
                        ]})
                        await SettingsModel.updateOne({channel: channel.id}, {blacklist: {allowedchannels: {commands: command_array}}})
                    } else {
                     interaction.reply({embeds: [
                        new MessageEmbed()
                        .setAuthor({name:`Command Added`})
                        .setDescription(`'\`${command_to_add}\`' has been added to the allowed commands list. You can check the currently allowed commands with \`/settings view-allowed-commands [channel]\`.`)
                        .setColor(`DARK_GOLD`)
                        .setTimestamp()
                        
                    ]})
                    if(channel_exists.blacklist.allowedchannels.commands.includes(`none`)){
                        await SettingsModel.updateOne({channel: channel.id}, {blacklist: {allowedchannels: {commands: [command_to_add]}}})
                        return
                    }
                    const array = await SettingsModel.findOne({channel: channel.id})
                    array.blacklist.allowedchannels.commands.push(command_to_add)
                    await array.save()
                }
        } else if (interaction.toString().includes(`/settings allowed-commands channel:${channel.id} remove-command`)){
            if(command_to_remove.toLowerCase() !== `all`){
            if(!command_array.includes(command_to_remove)){
                return interaction.reply({embeds: [
                    new MessageEmbed()
                    .setAuthor({name:`Invalid Command`})
                    .setDescription(`'\`${command_to_remove}\`' is not a valid command! The valid commands are: \`ask, balance, claim-reward, daily, help, ping, shop, staff-list, leaderboard, hug\` or you can type **All** to remove all commands.`)
                    .setColor(`DARK_GOLD`)
                    .setTimestamp()
                ]})
            }}
            if(!channel_exists){
                return interaction.reply({embeds: [
                    new MessageEmbed()
                    .setAuthor({name:`Invalid Channel`})
                    .setDescription(`${channel} is not in the allowed channels list! You can add it with \`/settings allowed-channels add-channel [channel]\`, and see the added channels with \`/settings view-allowed-channels\`!`)
                    .setColor(`DARK_GOLD`)
                    .setTimestamp()
                ]})
            } else if (command_to_remove.toLowerCase() !== `all`){
                if(!channel_exists.blacklist.allowedchannels.commands.includes(command_to_remove)){
                return interaction.reply({embeds: [
                    new MessageEmbed()
                    .setAuthor({name:`Command not Found`})
                    .setDescription(`'\`${command_to_remove}\`' is not on the allowed commands list. You can check the allowed commands with \`/settings view-allowed-commands [channel]\`!`)
                    .setColor(`DARK_GOLD`)
                    .setTimestamp()
                ]})
            }
            }
                if(command_to_remove.toLowerCase() === `all`){
                    if(channel_exists.blacklist.allowedchannels.commands.includes(`none`)){
                        return interaction.reply({embeds: [
                            new MessageEmbed()
                            .setDescription(`There are no commands to be removed. You can add one with \`/settings allowed-commands add-command [command]\`.`)
                        ], ephemeral: true})
                    }
                    await SettingsModel.updateOne({channel: channel.id}, {blacklist: {allowedchannels: {commands: `none`}}})
                    interaction.reply({embeds: [
                        new MessageEmbed()
                        .setAuthor({name:`Commands Removed`})
                        .setDescription(`Removed **All commands** from the allowed commands list.`)
                        .setColor(`DARK_GOLD`)
                        .setTimestamp()
                    ]})
                } else {
                interaction.reply({embeds: [
                   new MessageEmbed()
                   .setAuthor({name:`Command Removed`})
                   .setDescription(`'\`${command_to_remove}\`' has been removed from the allowed commands list. You can check the currently allowed commands with \`/settings view-allowed-commands [channel]\`.`)
                   .setColor(`DARK_GOLD`)
                   .setTimestamp()
               ]})
               const array = await SettingsModel.findOne({channel: channel.id})
                    array.blacklist.allowedchannels.commands.pull(command_to_remove)
                    await array.save()
           }
        }
    } else if (interaction.toString().includes(`/settings view-allowed-commands`)){
        const channel = interaction.options.getChannel(`channel`)
        const channel_exists = await SettingsModel.findOne({channel: channel.id})
        if(!channel_exists){
            return interaction.reply({embeds: [
                new MessageEmbed()
                .setAuthor({name:`Invalid Channel`})
                .setDescription(`${channel} is not in the allowed channels list! You can add it with \`/settings allowed-channels add-channel [channel]\`, and see the added channels with \`/settings view-allowed-channels\`!`)
                .setColor(`DARK_GOLD`)
                .setTimestamp()
            ]})
        } else {
            const allowed_commands = channel_exists.blacklist.allowedchannels.commands
            .map((command) => {
                return `\`${command}\``
            })
            const allowed_commands_string = allowed_commands.toString()
            return interaction.reply({embeds: [
                new MessageEmbed()
                .setAuthor({name:`Allowed Commands`})
                .setDescription(`
These are the allowed commands in ${channel}:
${allowed_commands_string}
                `)
                .setColor(`DARK_GOLD`)
                .setThumbnail(`https://d.furaffinity.net/art/vupiqueen/1655236864/1655236864.vupiqueen_fqx0vb5x0ain_mn.png`)
                .setTimestamp()
            ]})
        }
    }
    }
}

