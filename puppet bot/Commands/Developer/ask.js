const { CommandInteraction, MessageEmbed } = require("discord.js");

module.exports = {
    name: 'ask',
    description: 'Ask neco arc for money, maybe the cat likes you, or not.',
    permission: 'SEND_MESSAGES',
    /**
     * @param {CommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {
        const EconomyChecker = require('../../Structures/Schema/Economy_Checker')
        const user_exists = await EconomyChecker.findOne({ user: interaction.user.id })

        if(!user_exists){
            await EconomyChecker.create({ user: interaction.user.id, balance: 0 })
        }

        const command = await EconomyChecker.findOne({ user: interaction.user.id })
       const coins = Math.floor(Math.random() * 30)
        if(Math.floor(Date.now() / 1000) <= command.ask_cooldown){
         return interaction.reply({embeds: [
             new MessageEmbed()
             .setAuthor({name: `Cooldown`})
             .setDescription(`You are currently on cooldown! You can only ask for money again at <t:${command.ask_cooldown}:T>.`)
             .setColor(`#ff3067`)
         ]})
        }
        if(coins < 5){
        const random_message = Math.floor(Math.random() * 4)
        if (random_message === 1){
            global.thumbnail = `https://c.tenor.com/nYIZEwB4E1wAAAAC/nazrin-nyn.gif`
        } else if (random_message === 2){
            global.thumbnail = `https://c.tenor.com/TajFm9pWBTIAAAAC/touhou-nazrin.gif`
        } else if (random_message === 3){
            global.thumbnail = `https://c.tenor.com/w89d1-n3G3wAAAAC/nazrin-cheese.gif`
        } else {
            global.thumbnail = `https://c.tenor.com/LSp_1zgpYr4AAAAC/nazrin.gif`
        }
        interaction.reply({embeds: [
            new MessageEmbed()
            .setAuthor({name: `No coins earned`})
            .setThumbnail(`${thumbnail}`)
            .setColor(`#ff3067`)
        ]})
        const cooldown = Math.floor((Date.now() / 1000) + 180)
        command.ask_cooldown = cooldown
        await command.save()
       } else {
        const random_message = Math.floor(Math.random() * 5)
        if (random_message === 1){
            global.thumbnail = `https://c.tenor.com/L4p2V-qKKJQAAAAd/neco-arc-erection.gif`
        } else if (random_message === 2){
            global.thumbnail = `https://c.tenor.com/yySj-rH2-84AAAAd/neco-arc-dance.gif`
        } else if (random_message === 3){
            global.thumbnail = `https://c.tenor.com/N7IgehdIjUAAAAAd/neco-arc-club-penguin.gif`
        } else {
            global.thumbnail = `https://c.tenor.com/mvwMlJbEyTsAAAAd/neco-arc.gif`
        }
        interaction.reply({embeds: [
            new MessageEmbed()
            .setAuthor({name: `${coins} coins earned`})
            .setThumbnail(`${thumbnail}`)
            .setColor(`#ff3067`)
        ]})
        const new_balance = Math.floor(command.balance + coins)
        const cooldown = Math.floor((Date.now() / 1000) + 180)
        command.ask_cooldown = cooldown
        command.balance = new_balance
        await command.save()
       }
    }
}

