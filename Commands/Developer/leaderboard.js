const { CommandInteraction, MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");

module.exports = {
    name: 'leaderboard',
    description: 'Check the currency leaderboard.',
    permission: 'SEND_MESSAGES',
    /**
     * @param {CommandInteraction} interaction
     */
    async execute(interaction) {
        const SettingsModel = require('../../Structures/Schema/Settings')
        const is_blacklisted = await SettingsModel.findOne({channel: interaction.channel.id})
        if(is_blacklisted !== null){
            if(!is_blacklisted.blacklist.allowedchannels.commands.includes(`leaderboard`)){
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
        const EconomyChecker = require('../../Structures/Schema/Economy_Checker')
            
            const find = await EconomyChecker.find()
            const balance = find
            .map((user) =>{
                return user.balance
            })
            const sorted = balance.sort((a, b) => b-a)
            x = 0
            pages = 0
            stop_count = 0
            people = 0
            async function checkpages() {
                z = 0
                do{
                if(z >= find.length){
                global.max_pages = pages
                pages = 0
                stop_count = 1
            } else {
                z = z + 15
                pages++
            }}while(stop_count !== 1)
            } 
            async function nextpage() {
                array = []
                pages++
                    do{
                        const leaderboard = await EconomyChecker.findOne({balance: sorted[x]})
                        if(!leaderboard){
                            global.stop = 0
                            people = x-array.length-1
                        } else if (x === find.length){
                            people = x-array.length
                            global.stop = 0
                        } else {
                            global.stop = 1
                            array.push(`
                        **#${x+1}** | <@!${leaderboard.user}> with **${sorted[x]}** tedollars!`)
                        x++
                        }
                    } while (stop === 1)
                    const sorted_leaderboard = array.toString().replaceAll(`,`, ``)
                    global.embed = new MessageEmbed()
                    .setAuthor({name: `Leaderboard`})
                    .setColor(`#ff3067`)
                    .setDescription(sorted_leaderboard)
                    .setFooter({text: `Requested by ${interaction.user.tag}. | Page ${pages}/${max_pages}`})
                }
            async function previouspage(){
                pages--
                x = x-array.length
                array = []
                do{
                    const leaderboard = await EconomyChecker.findOne({balance: sorted[people]})
                    if(!leaderboard){
                        global.stop = 1
                        x = x + 15
                    } else if (x === 0) {
                        global.stop = 1
                        x = x + 15
                        array.unshift(`
                        **#${x}** | <@!${leaderboard.user}> with **${sorted[people]}** tedollars!`)
                    }else{
                        global.stop = 0
                        array.unshift(`
                    **#${x}** | <@!${leaderboard.user}> with **${sorted[people]}** tedollars!`)
                    people--
                    x--
                    }
                } while (stop !== 1)
                const sorted_leaderboard = array.toString().replaceAll(`,`, ``)
                global.embed = new MessageEmbed()
                .setAuthor({name: `Leaderboard`})
                .setColor(`#ff3067`)
                .setDescription(sorted_leaderboard)
                .setFooter({text: `Requested by ${interaction.user.tag}. | Page ${pages}/${max_pages}`})
            }
            function changepage(){
            if(pages === 1){
                global.ding = 1
            } else {
                global.ding = 0
            }
            if(find.length === x){
                global.dong = 1
            } else {
                global.dong = 0
            }
            if(ding+dong === 0){
                global.button = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setCustomId(`Previous_Page`)
                        .setLabel(`Previous Page`)
                        .setStyle(`PRIMARY`)
                )
                .addComponents(
                    new MessageButton()
                        .setCustomId(`Next_Page`)
                        .setLabel(`Next Page`)
                        .setStyle(`PRIMARY`)
                )
            } else if (ding+dong === 0){
                global.button = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setCustomId(`Previous_Page`)
                        .setLabel(`Previous Page`)
                        .setStyle(`PRIMARY`)
                        .setDisabled(true)
                )
                .addComponents(
                    new MessageButton()
                        .setCustomId(`Next_Page`)
                        .setLabel(`Next Page`)
                        .setStyle(`PRIMARY`)
                        .setDisabled(true)
                )
            } else if (ding+dong === 1){
                if(ding === 1){
                    global.button = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setCustomId(`Previous_Page`)
                        .setLabel(`Previous Page`)
                        .setStyle(`PRIMARY`)
                        .setDisabled(true)
                )
                .addComponents(
                    new MessageButton()
                        .setCustomId(`Next_Page`)
                        .setLabel(`Next Page`)
                        .setStyle(`PRIMARY`)
                )
                } else if (dong === 1){
                    global.button = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setCustomId(`Previous_Page`)
                        .setLabel(`Previous Page`)
                        .setStyle(`PRIMARY`)
                )
                .addComponents(
                    new MessageButton()
                        .setCustomId(`Next_Page`)
                        .setLabel(`Next Page`)
                        .setStyle(`PRIMARY`)
                        .setDisabled(true)
                )
                }
            }}
            changepage()
            await checkpages()
            pages++
    array = []
        do{
            const leaderboard = await EconomyChecker.findOne({balance: sorted[x]})
            array.push(`
            **#${x+1}** | <@!${leaderboard.user}> with **${sorted[x]}** tedollars!`)
             x++
        } while(x < 15)
    const sorted_leaderboard = array.toString().replaceAll(`,`, ``)
    interaction.reply({embeds: [
        new MessageEmbed()
        .setAuthor({name: `Leaderboard`})
        .setColor(`#ff3067`)
        .setDescription(sorted_leaderboard)
        .setFooter({text: `Requested by ${interaction.user.tag}. | Page ${pages}/${max_pages}`})
    ], components: [button]})
    const filter = (i) => i.user.id === interaction.user.id
    const collector = interaction.channel.createMessageComponentCollector({ filter, time: 15000 })
    collector.on(`collect`, async i => {
        if(i.customId === `Previous_Page`){
            i.deferUpdate()
            await previouspage()
            changepage()
            interaction.editReply({embeds: [embed], components: [button]})
            
        } else if(i.customId === `Next_Page`){
            i.deferUpdate()
            await nextpage()
            changepage()
            interaction.editReply({embeds: [embed], components: [button]})
            
        }
    })
    collector.on(`end`, async (collected, reason, i) => {
        if(reason === `time`){
            interaction.editReply({ components: [
                new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setCustomId(`Previous_Page`)
                        .setLabel(`Previous Page`)
                        .setStyle(`PRIMARY`)
                        .setDisabled(true),
                )
                .addComponents(
                    new MessageButton()
                        .setCustomId(`Next_Page`)
                        .setLabel(`Next Page`)
                        .setStyle(`PRIMARY`)
                        .setDisabled(true),
                )]})
        } else {
            interaction.editReply({ components: [
                new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setCustomId(`Previous_Page`)
                        .setLabel(`Previous Page`)
                        .setStyle(`PRIMARY`)
                        .setDisabled(true),
                )
                .addComponents(
                    new MessageButton()
                        .setCustomId(`Next_Page`)
                        .setLabel(`Next Page`)
                        .setStyle(`PRIMARY`)
                        .setDisabled(true),
                )]})
        }
    })
    }
}

