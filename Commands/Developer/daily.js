const { CommandInteraction, MessageEmbed } = require("discord.js");

module.exports = {
    name: 'daily',
    description: 'Claim your daily coins!',
    permission: 'SEND_MESSAGES',
    /**
     * @param {CommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {
        const SettingsModel = require('../../Structures/Schema/Settings.js')
        const is_blacklisted = await SettingsModel.findOne({channel: interaction.channel.id})
        if(is_blacklisted !== null){
            if(!is_blacklisted.blacklist.allowedchannels.commands.includes(`daily`)){
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
        const user_exists = await EconomyChecker.findOne({ user: interaction.user.id })
        const CommandModel = require(`../../Structures/Schema/Command_Checker`)
        const cmdschecker = await CommandModel.findOne({user: interaction.user.id})
        if(!cmdschecker){
            await CommandModel.create({user: interaction.user.id})
        }
        const usercmds = await CommandModel.findOne({user: interaction.user.id})

        if(!user_exists){
            await EconomyChecker.create({ user: interaction.user.id, balance: 0, daily_streak: 1 })
        }
        const check_streak = await EconomyChecker.findOne({ user: interaction.user.id })

        if(check_streak.daily_streak === undefined){
            check_streak.daily_streak = 1
            await check_streak.save()
        }
       if(Math.floor(Date.now() / 1000) <= check_streak.daily_cooldown){
           return interaction.reply({embeds: [
               new MessageEmbed()
               .setAuthor({name: `Cooldown`})
               .setDescription(`You are currently on cooldown! You can only claim the next daily at <t:${check_streak.daily_cooldown}>.`)
               .setColor(`#ff3067`)
           ]})
       } else if (Math.floor((Date.now() / 1000) >= (check_streak.daily_last_claimed + 172800))){
        check_streak.daily_streak = 1
        check_streak.daily_last_claimed = 0
        await check_streak.save()
       }
        const user_balance = await EconomyChecker.findOne({ user: interaction.user.id })
        const streak_coins = Math.floor(user_balance.daily_streak * 10)
        interaction.reply({embeds: [
            new MessageEmbed()
            .setAuthor({name: `Daily Claimed!`})
            .setDescription(`Neco arc has given you **50 + ${streak_coins}** coins!`)
            .setFooter({text: `You claimed daily for ${user_balance.daily_streak} days!`})
            .setColor(`#ff3067`)
            .setThumbnail(`https://cdn.discordapp.com/avatars/482926485359951893/dbc90304aa4a03214dff07f020c9fe30.png?size=256`)
        ]})
        const new_streak = user_balance.daily_streak + 1
        const cooldown = Math.floor((Date.now() / 1000) + 86400)
        const new_balance = Math.floor((streak_coins + 50) + user_balance.balance)
        user_balance.balance = new_balance
        user_balance.daily_streak = new_streak
        user_balance.daily_cooldown = cooldown
        user_balance.daily_last_claimed = Math.floor(Date.now() / 1000)
        await user_balance.save()
        if(usercmds.dailies === undefined){
            usercmds.dailies = 1
            await usercmds.save()
        } else {
            usercmds.dailies++
            await usercmds.save()
        }
    }
}

