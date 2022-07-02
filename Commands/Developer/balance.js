const { CommandInteraction, MessageEmbed } = require("discord.js");

module.exports = {
    name: 'balance',
    description: 'Shows commands related to balance.',
    permission: 'SEND_MESSAGES',
    options: [{
        name: `view`,
        description: 'View your current balance.',
        type: 'SUB_COMMAND',
        options: [{
            name:`user`,
            description: `View someone's balance.`,
            type: 'USER',
            required: false
        }],
    },
    {
        name: `give-coins`,
        description: 'Give coins to the user selected. (Staff Only.)',
        type: 'SUB_COMMAND',
        options: [{
            name: `user`,
            description: `The user to give coins to.`,
            type: `USER`,
            required: true
        },
        {
            name: `amount`,
            description: 'The amount of coins to give.',
            type: `NUMBER`,
            required: true
        }
    ]
    },
    {
        name: `remove-coins`,
        description: `Remove coins from the user selected. (Staff Only.)`,
        type: `SUB_COMMAND`,
        options: [{
            name: `user`,
            description: `The user to remove the coins from.`,
            type: `USER`,
            required: true
        },
        {
            name: `amount`,
            description: `The amount of coins to remove.`,
            type: `NUMBER`,
            required: true
        }
    ]
    }
],
    /**
     * @param {CommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {
        const EconomyChecker = require('../../Structures/Schema/Economy_Checker')
        const amount = interaction.options.getNumber(`amount`)
        const what_user = interaction.options.getUser(`user`)
        const member = await interaction.guild.members.fetch(interaction.user.id)
        const user_exists = await EconomyChecker.findOne({ user: interaction.user.id })

        if(!user_exists){
            await EconomyChecker.create({ user: interaction.user.id, balance: 0 })
            if(what_user !== null){
                await EconomyChecker.create({ user: what_user.id, balance: 0 })

            }
        }

        const user = await EconomyChecker.findOne({ user: interaction.user.id })

        if(user.balance === 0){
            global.footer = `Imagine having no tedollars, what a loser.`
        } else if (user.balance < 10000){
            global.footer = `Not enough tedollars, work more!`
        } else if(user.balance < 50000){
            global.footer = `Sounds like a good amount to me. Dont get robbed!`
        } else {
            global.footer = `Alright, you're the Elon of Musks with that amount of tedollars...`
        }


        if(interaction.toString().includes(`/balance view`)){
            if(what_user === null){
                global.whatuser = `none`
            } else {
                global.whatuser = what_user.id
            }
            if(interaction.toString() === `/balance view user:${whatuser}`){
                const check_user = await EconomyChecker.findOne({ user: whatuser })
                if(user.balance === 0){
                    global.other_footer = `Imagine having no tedollars, what a loser.`
                } else if (user.balance < 10000){
                    global.other_footer = `Let that person get some more money, one day they will get robbed...`
                } else if(user.balance < 50000){
                    global.other_footer = `Would be bad if that person got robbed...`
                } else {
                    global.other_footer = `Kinda weird how none of this tedollars were stolen yet...`
                }
                if(what_user.id === interaction.user.id){
                    return interaction.reply({embeds: [
                        new MessageEmbed()
                        .setAuthor({name: `${interaction.member.user.tag}`, iconURL: `${interaction.member.user.avatarURL()}`})
                        .setColor(`#ff3067`)
                        .setDescription(`You currently have **${user.balance}** <:tedollar:987097348305997847> tedollars!`)
                        .setFooter({text: `${footer}`})
                    ]})
                } else {
                    return interaction.reply({embeds: [
                        new MessageEmbed()
                        .setAuthor({name: `${interaction.member.user.tag}`, iconURL: `${interaction.member.user.avatarURL()}`})
                        .setColor(`#ff3067`)
                        .setDescription(`<@!${whatuser}> currently has **${check_user.balance}** <:tedollar:987097348305997847> tedollars! Why do you want to know this tho...`)
                        .setFooter({text: `${other_footer}`})
                    ]})
                }
            }
            return interaction.reply({embeds: [
                new MessageEmbed()
                .setAuthor({name: `${interaction.member.user.tag}`, iconURL: `${interaction.member.user.avatarURL()}`})
                .setColor(`#ff3067`)
                .setDescription(`You currently have **${user.balance}** <:tedollar:987097348305997847> tedollars!`)
                .setFooter({text: `${footer}`})
            ]})
        } else if (interaction.toString() === `/balance give-coins user:${what_user.id} amount:${amount}`){
            if(!member.roles.cache.has(`970229987405877259`)){
                return interaction.reply({embeds: [
                    new MessageEmbed()
                    .setAuthor({name: `Missing permissions`})
                    .setDescription(`You dont have enough permissions to run this command!`)
                ]})
            }
            const user_exists = await EconomyChecker.findOne({ user: what_user.id })
            if(!user_exists){
                await EconomyChecker.create({user: what_user.id, balance: 0})
            }
            interaction.reply({embeds: [
                new MessageEmbed()
                .setAuthor({name: `${interaction.member.user.tag}`, iconURL: `${interaction.member.user.avatarURL()}`})
                .setColor(`#ff3067`)
                .setDescription(`You have given **${amount}** tedollars to <@!${what_user.id}>!`)
                .setFooter({text: `What a generous person.`})
            ]})
            const user_giving = await EconomyChecker.findOne({ user: what_user.id })
            if(user_giving.user === what_user.id){
                const new_balance = Math.floor(user_giving.balance + amount)
                user_giving.balance = new_balance
                await user_giving.save()
        }
    } else if (interaction.toString() === `/balance remove-coins user:${what_user.id} amount:${amount}`) {
        if(!member.roles.cache.has(`970229987405877259`)){
            return interaction.reply({embeds: [
                new MessageEmbed()
                .setAuthor({name: `Missing permissions`})
                .setDescription(`You dont have enough permissions to run this command!`)
            ]})
        }
        const user_exists = await EconomyChecker.findOne({ user: what_user.id })
            if(!user_exists){
                await EconomyChecker.create({user: what_user.id, balance: 0})
            }
            const user = await EconomyChecker.findOne({ user: what_user.id })
            if(user.balance === 0){
                interaction.reply({embeds: [
                    new MessageEmbed()
                    .setAuthor({name: `${interaction.member.user.tag}`, iconURL: `${interaction.member.user.avatarURL()}`})
                    .setColor(`#ff3067`)
                    .setDescription(`You cannot remove tedollars from someone that has no tedollars.`)
                    .setFooter({text: `What is wrong with you?`})
                ]})
            } else if(Math.floor(user.balance - amount) < 0) {
                interaction.reply({embeds: [
                    new MessageEmbed()
                    .setAuthor({name: `${interaction.member.user.tag}`, iconURL: `${interaction.member.user.avatarURL()}`})
                    .setColor(`#ff3067`)
                    .setDescription(`You cannot make someone's balance negative!`)
                    .setFooter({text: `Do you want their soul too?`})
                ]})
            } else {
                interaction.reply({embeds: [
                    new MessageEmbed()
                    .setAuthor({name: `${interaction.member.user.tag}`, iconURL: `${interaction.member.user.avatarURL()}`})
                    .setColor(`#ff3067`)
                    .setDescription(`You have removed **${amount}** tedollars from <@!${what_user.id}>!`)
                    .setFooter({text: `Might aswell take everything from that person.`})
                ]})
            if(user.user === what_user.id){
                const new_balance = user.balance - amount
                user_giving.balance = new_balance
                await user_giving.save()
            }
            }
    }
    }
}

