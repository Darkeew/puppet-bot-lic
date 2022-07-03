const { CommandInteraction, MessageEmbed } = require("discord.js");

module.exports = {
    name: 'claim-reward',
    description: 'Claim rewards given to you!',
    permission: 'SEND_MESSAGES',
    options: [{
        name: `level`,
        description: 'The level of the reward you want to claim.',
        type: `STRING`,
        choices: [{
            name: `Level 5`,
            value: `Level 5`,
        }, 
        {
            name: `Level 10`,
            value: `Level 10`,
        }, 
        {
            name: `Level 20`,
            value: `Level 20`,
        },
        {
            name: `Level 30`,
            value: `Level 30`,
        },
        {
            name: `Level 40`,
            value: `Level 40`
        },
        {
            name: `Level 50`,
            value: `Level 50`,
        },
        {
            name: `Level 75`,
            value: `Level 75`,
        },
        {
            name: `Level 100`,
            value: `Level 100`,
        },
    ],
    }
],
    /**
     * @param {CommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {
        const SettingsModel = require('../../Structures/Schema/Settings.js')
        const is_blacklisted = await SettingsModel.findOne({channel: interaction.channel.id})
        if(is_blacklisted !== null){
            if(!is_blacklisted.blacklist.allowedchannels.commands.includes(`claim-reward`)){
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

        if(!user_exists){
            await EconomyChecker.create({ user: interaction.user.id, balance: 0 })
        }
        const member = await interaction.guild.members.fetch(interaction.user.id)
        const claimed = await EconomyChecker.findOne({ user: interaction.user.id })
        if(interaction.toString() === `/claim-reward level:Level 5`){
            if(claimed.claimed_level_5 === true){
                return interaction.reply({embeds: [
                    new MessageEmbed()
                    .setAuthor({name: `Reward Already Claimed`})
                    .setDescription(`You already claimed this reward!`)
                    .setColor(`#ff3067`)

                ], ephemeral: true})
            } else if (!member.roles.cache.has(`946524142025465868`)){
                return interaction.reply({embeds: [
                    new MessageEmbed()
                    .setAuthor({name: `Cannot Claim`})
                    .setDescription(`You dont have the role needed to claim this reward! (You need the role: <@&946524142025465868>)`)
                    .setColor(`#ff3067`)
                ], ephemeral: true})
            } else {
                interaction.reply({embeds: [
                    new MessageEmbed()
                    .setAuthor({name: `Reward Claimed`})
                    .setDescription(`You have claimed the reward for the role <!&946524142025465868>! **500** tedollars have been added to your balance.`)
                ]})
                claimed.claimed_level_5 = true
                const new_balance = claimed.balance + 500
                claimed.balance = new_balance
                await claimed.save()
            }
        } else if (interaction.toString() === `/claim-reward level:Level 10`) {
            if(claimed.claimed_level_10 === true){
                return interaction.reply({embeds: [
                    new MessageEmbed()
                    .setAuthor({name: `Reward Already Claimed`})
                    .setDescription(`You already claimed this reward!`)
                    .setColor(`#ff3067`)

                ], ephemeral: true})
            } else if (!member.roles.cache.has(`946524226804920392`)){
                return interaction.reply({embeds: [
                    new MessageEmbed()
                    .setAuthor({name: `Cannot Claim`})
                    .setDescription(`You dont have the role needed to claim this reward! (You need the role: <@&946524226804920392>)`)
                    .setColor(`#ff3067`)
                ], ephemeral: true})
            } else {
                interaction.reply({embeds: [
                    new MessageEmbed()
                    .setAuthor({name: `Reward Claimed`})
                    .setDescription(`You have claimed the reward for the role <&946524226804920392>! **1000** tedollars have been added to your balance.`)
                ]})
                claimed.claimed_level_10 = true
                const new_balance = claimed.balance + 1000
                claimed.balance = new_balance
                await claimed.save()
            }
        } else if (interaction.toString(`/claim-reward level:Level 20`)){
            if(claimed.claimed_level_20 === true){
                return interaction.reply({embeds: [
                    new MessageEmbed()
                    .setAuthor({name: `Reward Already Claimed`})
                    .setDescription(`You already claimed this reward!`)
                    .setColor(`#ff3067`)

                ], ephemeral: true})
            } else if (!member.roles.cache.has(`946524331649937408`)){
                return interaction.reply({embeds: [
                    new MessageEmbed()
                    .setAuthor({name: `Cannot Claim`})
                    .setDescription(`You dont have the role needed to claim this reward! (You need the role: <@&946524331649937408>)`)
                    .setColor(`#ff3067`)
                ], ephemeral: true})
            } else {
                interaction.reply({embeds: [
                    new MessageEmbed()
                    .setAuthor({name: `Reward Claimed`})
                    .setDescription(`You have claimed the reward for the role <&946524331649937408>! **2000** tedollars have been added to your balance.`)
                ]})
                claimed.claimed_level_20 = true
                const new_balance = claimed.balance + 2000
                claimed.balance = new_balance
                await claimed.save()
            }
        } else if (interaction.toString(`/claim-reward level:Level 30`)){
            if(claimed.claimed_level_30 === true){
                return interaction.reply({embeds: [
                    new MessageEmbed()
                    .setAuthor({name: `Reward Already Claimed`})
                    .setDescription(`You already claimed this reward!`)
                    .setColor(`#ff3067`)

                ], ephemeral: true})
            } else if (!member.roles.cache.has(`946524414642642974`)){
                return interaction.reply({embeds: [
                    new MessageEmbed()
                    .setAuthor({name: `Cannot Claim`})
                    .setDescription(`You dont have the role needed to claim this reward! (You need the role: <@&946524414642642974>)`)
                    .setColor(`#ff3067`)
                ], ephemeral: true})
            } else {
                interaction.reply({embeds: [
                    new MessageEmbed()
                    .setAuthor({name: `Reward Claimed`})
                    .setDescription(`You have claimed the reward for the role <&946524414642642974>! **3000** tedollars have been added to your balance.`)
                ]})
                claimed.claimed_level_30 = true
                const new_balance = claimed.balance + 3000
                claimed.balance = new_balance
                await claimed.save()
            }
        } else if (interaction.toString() === `/claim-reward level:Level 40`){
            if(claimed.claimed_level_40 === true){
                return interaction.reply({embeds: [
                    new MessageEmbed()
                    .setAuthor({name: `Reward Already Claimed`})
                    .setDescription(`You already claimed this reward!`)
                    .setColor(`#ff3067`)

                ], ephemeral: true})
            } else if (!member.roles.cache.has(`946524509937238067`)){
                return interaction.reply({embeds: [
                    new MessageEmbed()
                    .setAuthor({name: `Cannot Claim`})
                    .setDescription(`You dont have the role needed to claim this reward! (You need the role: <@&946524509937238067>)`)
                    .setColor(`#ff3067`)
                ], ephemeral: true})
            } else {
                interaction.reply({embeds: [
                    new MessageEmbed()
                    .setAuthor({name: `Reward Claimed`})
                    .setDescription(`You have claimed the reward for the role <&946524509937238067>! **4000** tedollars have been added to your balance.`)
                ]})
                claimed.claimed_level_40 = true
                const new_balance = claimed.balance + 4000
                claimed.balance = new_balance
                await claimed.save()
            }
        } else if (interaction.toString() === `/claim-reward level:Level 50`){
            if(claimed.claimed_level_50 === true){
                return interaction.reply({embeds: [
                    new MessageEmbed()
                    .setAuthor({name: `Reward Already Claimed`})
                    .setDescription(`You already claimed this reward!`)
                    .setColor(`#ff3067`)

                ], ephemeral: true})
            } else if (!member.roles.cache.has(`946524586080628856`)){
                return interaction.reply({embeds: [
                    new MessageEmbed()
                    .setAuthor({name: `Cannot Claim`})
                    .setDescription(`You dont have the role needed to claim this reward! (You need the role: <@&946524586080628856>)`)
                    .setColor(`#ff3067`)
                ], ephemeral: true})
            } else {
                interaction.reply({embeds: [
                    new MessageEmbed()
                    .setAuthor({name: `Reward Claimed`})
                    .setDescription(`You have claimed the reward for the role <&946524586080628856>! **5000** tedollars have been added to your balance.`)
                ]})
                claimed.claimed_level_50 = true
                const new_balance = claimed.balance + 5000
                claimed.balance = new_balance
                await claimed.save()
            }
        } else if (interaction.toString() === `/claim-reward level:Level 75`){
            if(claimed.claimed_level_75 === true){
                return interaction.reply({embeds: [
                    new MessageEmbed()
                    .setAuthor({name: `Reward Already Claimed`})
                    .setDescription(`You already claimed this reward!`)
                    .setColor(`#ff3067`)

                ], ephemeral: true})
            } else if (!member.roles.cache.has(`946525294217547796`)){
                return interaction.reply({embeds: [
                    new MessageEmbed()
                    .setAuthor({name: `Cannot Claim`})
                    .setDescription(`You dont have the role needed to claim this reward! (You need the role: <@&946525294217547796>)`)
                    .setColor(`#ff3067`)
                ], ephemeral: true})
            } else {
                interaction.reply({embeds: [
                    new MessageEmbed()
                    .setAuthor({name: `Reward Claimed`})
                    .setDescription(`You have claimed the reward for the role <&946525294217547796>! **7500** tedollars have been added to your balance.`)
                ]})
                claimed.claimed_level_75 = true
                const new_balance = claimed.balance + 7500
                claimed.balance = new_balance
                await claimed.save()
            }
        } else {
            if(claimed.claimed_level_100 === true){
                return interaction.reply({embeds: [
                    new MessageEmbed()
                    .setAuthor({name: `Reward Already Claimed`})
                    .setDescription(`You already claimed this reward!`)
                    .setColor(`#ff3067`)

                ], ephemeral: true})
            } else if (!member.roles.cache.has(`946525383480721438`)){
                return interaction.reply({embeds: [
                    new MessageEmbed()
                    .setAuthor({name: `Cannot Claim`})
                    .setDescription(`You dont have the role needed to claim this reward! (You need the role: <@&946525383480721438>)`)
                    .setColor(`#ff3067`)
                ], ephemeral: true})
            } else {
                interaction.reply({embeds: [
                    new MessageEmbed()
                    .setAuthor({name: `Reward Claimed`})
                    .setDescription(`You have claimed the reward for the role <&946525383480721438>! **1000** tedollars have been added to your balance.`)
                ]})
                claimed.claimed_level_100 = true
                const new_balance = claimed.balance + 10000
                claimed.balance = new_balance
                await claimed.save()
            }
        }
    }
}

