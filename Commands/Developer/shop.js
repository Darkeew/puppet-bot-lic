const { CommandInteraction, MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");

module.exports = {
    name: 'shop',
    description: 'Shows commands related to the shop.',
    permission: 'SEND_MESSAGES',
    options: [{
        name: `view`,
        description: `Shows what is currently for sale in the shop!`,
        type: `SUB_COMMAND`,
    },
    {
        name: `buy`,
        description: `Buy something from the shop.`,
        type: `SUB_COMMAND`,
        options: [{
            name: `item`,
            description: `The item you want to buy.`,
            type: `STRING`,
            required: true
        }]
    },
    {
        name: `add-item`,
        description: `Adds an item to the shop. (Admin Only)`,
        type: `SUB_COMMAND`,
        options: [{
            name: `name`,
            description: `The name of the item to add.`,
            type: `STRING`,
            required: true
        },
        {
            name: `description`,
            description: `The description of the item.`,
            type: `STRING`,
            required: true
        },
        {
            name: `price`,
            description: `The price of the item.`,
            type: `NUMBER`,
            required: true
        },
        {
            name: `role`,
            description: `Add a role to the shop.`,
            type: `ROLE`,
            required: true
        },
        {
            name: `stock`,
            description: `How much is available before removing the item from the shop. (Optional)`,
            type: `NUMBER`,
            required: false
        }
    ],
    },
    {
        name: `remove-item`,
        description: `Removes an item from the shop. (Admin Only)`,
        type: `SUB_COMMAND`,
        options: [{
            name: `name`,
            description: `The name of the item to remove.`,
            type: `STRING`,
            required: true
        }]
    }
],
    /**
     * @param {CommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {
        const ShopItems = require('../../Structures/Schema/Shop_Items')
        const EconomyChecker = require('../../Structures/Schema/Economy_Checker')
        const item = interaction.options.getString(`name`)
        const description = interaction.options.getString(`description`)
        const stock = interaction.options.getNumber(`stock`)
        const member = await interaction.guild.members.fetch(interaction.user.id)
        const price = interaction.options.getNumber(`price`)
        const what_item = interaction.options.getString(`item`)
        const RestartsModel = require('../../Structures/Schema/Restarts.js')
        const current_pages = await RestartsModel.findOne({owner: 'Darkeew'})
        const role = interaction.options.getRole(`role`)
        const SettingsModel = require('../../Structures/Schema/Settings.js')
        //This is not working
        const is_blacklisted = await SettingsModel.findOne({channel: interaction.channel.id})
        if(is_blacklisted){
            if(!is_blacklisted.blacklist.allowedchannels.commands.includes(`shop`)){
                return interaction.reply({embeds: [
                    new MessageEmbed()
                    .setDescription(`This command has been disabled in this channel.`)
                ], ephemeral: true})
            }
        }
        if(role !== null){
            global.roley = role.id
        } else {
            global.roley = `none`
        }
        if(interaction.toString() === `/shop view`){
            const items_exist = await ShopItems.find()
            if(items_exist.length === 0) {
                return interaction.reply({embeds: [
                    new MessageEmbed()
                    .setAuthor({name: `Teto Shop`})
                    .setColor(`#ff3067`)
                    .setDescription(`> There are currently no items in the shop!`)
                    .setFooter({text: `You can add items to the shop with '/shop add-item!'`})
                ]})
            }
            const all_items = await ShopItems.find()
            global.page = 1
            function newpage() {
                    const items = all_items
                    .map((value) =>{
                        if(value.page === page){
                        if (value.stock !== undefined){
                            return `- \`${value.name}\` for **${value.price}** <:tedollar:987097348305997847> tedollars!
                            > **Description:** \`${value.description}\`
                            > **Contains:** <@&${value.role}>
                            > **Stock Remaining:** \`${value.stock}\`
        `       
                        } else if (value.role !== undefined){
                            return `- \`${value.name}\` for **${value.price}** <:tedollar:987097348305997847> tedollars!
                            > **Description:** \`${value.description}\`
                            > **Contains:** <@&${value.role}>
        `
                        } else {
                        return `- \`${value.name}\` for **${value.price}** <:tedollar:987097348305997847> tedollars!
                            > **Description:** \`${value.description}\`
        
        ` }}
                    })
                    const shop_items = items.toString().replaceAll(`,`, ``)
                    global.shop = new MessageEmbed()
                    .setAuthor({name: `Teto Shop `})
                    .setDescription(`${shop_items}`)
                    .setColor(`#ff3067`)
                    .setThumbnail(`https://d.furaffinity.net/art/vupiqueen/1655236864/1655236864.vupiqueen_fqx0vb5x0ain_mn.png`)
            }
            function changepage() {
             if(current_pages.pages === 1) {
                global.button = new MessageActionRow()
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
                )
            }else if(page === 1){
                global.button = new MessageActionRow()
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
                )
            }else if (page === current_pages.pages) {
                global.button = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setCustomId(`Previous_Page`)
                        .setLabel(`Previous Page`)
                        .setStyle(`PRIMARY`),
                )
                .addComponents(
                    new MessageButton()
                        .setCustomId(`Next_Page`)
                        .setLabel(`Next Page`)
                        .setStyle(`PRIMARY`)
                        .setDisabled(true),
                )
            } else (
               global.button = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setCustomId(`Previous_Page`)
                        .setLabel(`Previous Page`)
                        .setStyle(`PRIMARY`),
                )
                .addComponents(
                    new MessageButton()
                        .setCustomId(`Next_Page`)
                        .setLabel(`Next Page`)
                        .setStyle(`PRIMARY`),
                )
            )}
            newpage()
            changepage()
            interaction.reply({ embeds: [shop] ,components: [button]})
            const filter = (i) => i.user.id === interaction.user.id
            const collector = interaction.channel.createMessageComponentCollector({ filter, time: 15000 })
            const message_filter = (m) => m.user.id === interaction.user.id
            const message_collector = interaction.channel.createMessageCollector({ message_filter, time: 15000 })
            message_collector.on(`collect`, async m => {
                if(m.toString().includes(`/`)){
                    collector.stop()
                    message_collector.stop()
                    return
                }
            })
            collector.on(`collect`, async i => {
                if(i.customId === `Previous_Page`){
                    i.deferUpdate()
                    global.page--
                    newpage()
                    changepage()
                    interaction.editReply({ embeds: [shop], components: [button]})
                    
                } else if(i.customId === `Next_Page`){
                    i.deferUpdate()
                    global.page++
                    newpage()
                    changepage()
                    interaction.editReply({ embeds: [shop], components: [button]})
                    
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
        } else if (interaction.toString() === `/shop buy item:${what_item}`){
            function buyshoplog() {
                const new_balance = Math.floor(user_balance.balance - exists.price)
                const channel = interaction.guild.channels.cache.get('986596808132272128')
                channel.send({embeds: [
                    new MessageEmbed()
                    .setAuthor({name: `Item Bought`})
                    .setDescription(`<@!${interaction.user.id}> has bought \`${what_item}\` for ${exists.price} <:tedollar:987097348305997847> tedollars!. It contained the role <@&${exists.role}> with \`${exists.description}\` as its description. He now has \`${new_balance}\` coins.`)
                    .setColor(`DARK_GOLD`)
                    .setTimestamp()
                ]})
            }
            const exists = await ShopItems.findOne({name: `${what_item}`})
            const user_exists = await EconomyChecker.findOne({ user: interaction.user.id })
            if(!user_exists){
                await EconomyChecker.create({ user: interaction.user.id, balance: 0})
            }
            const user_balance = await EconomyChecker.findOne({ user: interaction.user.id })
            if(exists !== null){
                if(exists.name === `${what_item}`){
                   if(exists.price > user_balance.balance){
                    interaction.reply({embeds: [
                        new MessageEmbed()
                        .setAuthor({name: `${interaction.member.user.tag}`, iconURL: `${interaction.member.user.avatarURL()}`})
                        .setColor(`#ff3067`)
                        .setDescription(`You cannot afford \`${what_item}\` since you only have **${user_balance.balance}** <:tedollar:987097348305997847> tedollars and the item costs **${exists.price}** <:tedollar:987097348305997847> tedollars!`)
                        .setFooter({text: `Maybe next time.`})
                    ]})
                   } else {
                    interaction.reply({embeds: [
                        new MessageEmbed()
                        .setAuthor({name: `${interaction.member.user.tag}`, iconURL: `${interaction.member.user.avatarURL()}`})
                        .setColor(`#ff3067`)
                        .setDescription(`You have successfully purchased \`${what_item}\` for **${exists.price} <:tedollar:987097348305997847> tedollars!**`)
                        .setFooter({text: `You now have ${Math.floor(user_balance.balance - exists.price)} tedollars.`})
                    ]})
                    const member = await interaction.guild.members.fetch(interaction.user.id)
                    const role = await interaction.guild.roles.fetch(`${exists.role}`)
                    member.roles.add(role)
                    interaction.channel.send({embeds: [
                        new MessageEmbed()
                        .setAuthor({name: `${interaction.member.user.tag}`, iconURL: `${interaction.member.user.avatarURL()}`})
                        .setColor(`#ff3067`)
                        .setDescription(`Added role <@&${exists.role}> to <@!${interaction.user.id}>`)
                    ]})
                    if(user_balance.inventory === `[]`){
                        await EconomyChecker.updateOne({}, {$push: {inventory: `${what_item}`}})
                    } else {
                        await EconomyChecker.updateOne({}, {$push: {inventory: `${what_item}`}})
                    }
                    const new_balance = Math.floor(user_balance.balance - exists.price)
                    user_balance.balance = new_balance
                    buyshoplog()
                    if (exists.stock !== undefined){
                        if(exists.stock === 1){
                            const channel = interaction.guild.channels.cache.get('986596808132272128')
                            channel.send({content: `<@!482926485359951893>, <@!452436342841016341>`, embeds: [
                                new MessageEmbed()
                                .setAuthor({name: `Item Out of Stock`})
                                .setDescription(`\`${what_item}\` ran out of stock! It had a price of ${exists.price} <:tedollar:987097348305997847> tedollars. It contained the role <@&${exists.role}> with \`${exists.description}\` as its description. The last user that purchased this was <@!${interaction.user.id}>`)
                                .setColor(`DARK_GOLD`)
                                .setTimestamp()
                ]})
                            await ShopItems.deleteOne({}, {name: what_item})
                        } else {
                        exists.stock--
                        await exists.save()
                    }
                    await user_balance.save()
                } 
                   }
                }
            } else {
                interaction.reply({embeds: [
                    new MessageEmbed()
                    .setAuthor({name: `${interaction.member.user.tag}`, iconURL: `${interaction.member.user.avatarURL()}`})
                    .setColor(`#ff3067`)
                    .setDescription(`That item is not in the shop.`)
                    .setFooter({text: `Check the shop using /shop view!`})
                ]})
            }
        } else if (interaction.toString() === `/shop add-item name:${item} description:${description} price:${price} role:${roley}`){
            const RestartsModel = require('../../Structures/Schema/Restarts.js')
            const what_pages = await RestartsModel.findOne({owner: 'Darkeew'})
            function addshoplog() {
                const channel = interaction.guild.channels.cache.get('986596808132272128')
                channel.send({embeds: [
                    new MessageEmbed()
                    .setAuthor({name: `New Item`})
                    .setDescription(`<@!${interaction.user.id}> has added the item \`${item}\` for \`${price}\` <:tedollar:987097348305997847> tedollars. It contains the role ${role} and has \`${description}\` as its description.`)
                    .setColor(`DARK_GOLD`)
                    .setTimestamp()
                ]})
            }
            if(!member.roles.cache.has(`946525953033646130`)){
                return interaction.reply({embeds: [
                    new MessageEmbed()
                    .setAuthor({name: `Missing permissions`})
                    .setDescription(`You dont have enough permissions to run this command!`)
                ]})
            }
            if(what_pages != undefined){
                if(!what_pages.pages){
                    await RestartsModel.updateOne({}, {pages: 1})
                }
            }
            const how_long = await ShopItems.find({}, {_id: 0, name: 0, description: 0, price: 0, __v: 0})
            const edited1 = how_long.toString().replaceAll(`{ page:`, ``)
            const edited2 = edited1.replaceAll(` }`, ``)
            const current_number = edited2.split(` `)
            global.index = 5
            global.updated_pages = await RestartsModel.findOne({owner: 'Darkeew'})
            do{
                const what_pages = await RestartsModel.findOne({owner: 'Darkeew'})
                if(what_pages.pages === 1){
                    global.index = 0
                } else {
                const new_pages = Math.floor(what_pages.pages - 1)
                await RestartsModel.updateOne({pages: new_pages})
                global.updated_pages = await RestartsModel.findOne({owner: 'Darkeew'})
            }}
            while(current_number[Math.floor(index * updated_pages.pages)] === undefined)
            const current_pages = await RestartsModel.findOne({owner: 'Darkeew'})
            const exists = await ShopItems.findOne({name: `${item}`})
            if(exists !== null){
            if(exists.name === `${item}`){
                interaction.reply({embeds: [
                    new MessageEmbed()
                    .setAuthor({name: `Already on the shop`})
                    .setDescription(`\`${item}\` is already in the shop!`)
                    .setColor(`#ff3067`)
                ]})
                return
            }}
            if(role !== null){
                interaction.reply({embeds: [
                    new MessageEmbed()
                    .setAuthor({name: `Item added`})
                    .setDescription(`Added the item '\`${item}\`' that gives the role '${role}' to the buyer in the shop for \`${price}\` <:tedollar:987097348305997847> tedollars with description: '\`${description}\`'.`)
                    .setColor(`#ff3067`)
                ]})
                await ShopItems.create({name: `${item}`, description: `${description}`, price: `${price}`, role: `${role.id}`, page: `${current_pages.pages}`})
                addshoplog()
            } else {
                interaction.reply({embeds: [
                    new MessageEmbed()
                    .setAuthor({name: `Item added`})
                    .setDescription(`Added \`${item}\` in the shop for \`${price}\` coins with description: \`${description}\`.`)
                    .setColor(`#ff3067`)
                ]})
                await ShopItems.create({name: `${item}`, description: `${description}`, price: `${price}`, page: `${current_pages.pages}`})
                addshoplog()
            }
            if(current_number[5] !== undefined){
                if(current_number[5] !== current_pages.pages){
                    if(current_number[Math.floor(5 * current_pages.pages)] !== undefined){
                    number = current_pages.pages + 1
                    await RestartsModel.updateOne({pages: number})
                    }
                } else {
                    number = current_pages.pages + 1
                    await RestartsModel.updateOne({pages: number})
                }
            }
        } else if (interaction.toString() === `/shop add-item name:${item} description:${description} price:${price} role:${roley} stock:${stock}`) {
            const RestartsModel = require('../../Structures/Schema/Restarts.js')
            const what_pages = await RestartsModel.findOne({owner: 'Darkeew'})
            function addshoplog() {
                const channel = interaction.guild.channels.cache.get('986596808132272128')
                channel.send({embeds: [
                    new MessageEmbed()
                    .setAuthor({name: `New Item`})
                    .setDescription(`<@!${interaction.user.id}> has added the item \`${item}\` for \`${price}\` <:tedollar:987097348305997847> tedollars. It contains the role ${role} and has \`${description}\` as its description with \`${stock}\` stock.`)
                    .setColor(`DARK_GOLD`)
                    .setTimestamp()
                ]})
            }
            //if(!member.roles.cache.has(`946525953033646130`)){
            //    return interaction.reply({embeds: [
            //        new MessageEmbed()
            //        .setAuthor({name: `Missing permissions`})
            //        .setDescription(`You dont have enough permissions to run this command!`)
            //    ]})
            //}
            if(what_pages != undefined){
                if(!what_pages.pages){
                    await RestartsModel.updateOne({}, {pages: 1})
                }
            }
            const how_long = await ShopItems.find({}, {_id: 0, name: 0, description: 0, price: 0, __v: 0})
            const edited1 = how_long.toString().replaceAll(`{ page:`, ``)
            const edited2 = edited1.replaceAll(` }`, ``)
            const current_number = edited2.split(` `)
            global.index = 5
            global.updated_pages = await RestartsModel.findOne({owner: 'Darkeew'})
            do{
                const what_pages = await RestartsModel.findOne({owner: 'Darkeew'})
                if(what_pages.pages === 1){
                    global.index = 0
                } else {
                const new_pages = Math.floor(what_pages.pages - 1)
                await RestartsModel.updateOne({pages: new_pages})
                global.updated_pages = await RestartsModel.findOne({owner: 'Darkeew'})
            }}
            while(current_number[Math.floor(index * updated_pages.pages)] === undefined)
            const current_pages = await RestartsModel.findOne({owner: 'Darkeew'})
            const exists = await ShopItems.findOne({name: `${item}`})
            if(exists !== null){
            if(exists.name === `${item}`){
                interaction.reply({embeds: [
                    new MessageEmbed()
                    .setAuthor({name: `Already on the shop`})
                    .setDescription(`\`${item}\` is already in the shop!`)
                    .setColor(`#ff3067`)
                ]})
                return
            }}
            if(role !== null){
                interaction.reply({embeds: [
                    new MessageEmbed()
                    .setAuthor({name: `Item added`})
                    .setDescription(`Added the item '\`${item}\`' that gives the role '${role}' to the buyer in the shop for \`${price}\` <:tedollar:987097348305997847> tedollars with description: '\`${description}\`' and with \`${stock}\` stock.`)
                    .setColor(`#ff3067`)
                ]})
                await ShopItems.create({name: `${item}`, description: `${description}`, price: `${price}`, role: `${role.id}`, page: `${current_pages.pages}`, stock:`${stock}`})
                addshoplog()
            }
            if(current_number[5] !== undefined){
                if(current_number[5] !== current_pages.pages){
                    if(current_number[Math.floor(5 * current_pages.pages)] !== undefined){
                    number = current_pages.pages + 1
                    await RestartsModel.updateOne({pages: number})
                    }
                } else {
                    number = current_pages.pages + 1
                    await RestartsModel.updateOne({pages: number})
                }
            }
        } else if (interaction.toString().includes(`/shop remove-item name:${item}`)){
            function removeshoplog() {
                if(exists.stock === undefined){
                const channel = interaction.guild.channels.cache.get('986596808132272128')
                channel.send({embeds: [
                    new MessageEmbed()
                    .setAuthor({name: `Item Removed`})
                    .setDescription(`<@!${interaction.user.id}> has removed the item '\`${item}\`' from the shop. It had a price of \`${exists.price}\` <:tedollar:987097348305997847> tedollars and it contained the role <@&${exists.role}> with '\`${exists.description}\`' as its description.`)
                    .setColor(`DARK_GOLD`)
                    .setTimestamp()
                ]})
            } else {
                const channel = interaction.guild.channels.cache.get('986596808132272128')
                channel.send({embeds: [
                    new MessageEmbed()
                    .setAuthor({name: `Item Removed`})
                    .setDescription(`<@!${interaction.user.id}> has removed the item '\`${item}\`' from the shop. It had a price of \`${exists.price}\` <:tedollar:987097348305997847> tedollars and it contained the role <@&${exists.role}> with '\`${exists.description}\`' as its description, and it had \`${exists.stock}\` remaining stock.`)
                    .setColor(`DARK_GOLD`)
                    .setTimestamp()
                ]})
            }
            }
            const exists = await ShopItems.findOne({name: `${item}`})
           if(!member.roles.cache.has(`946525953033646130`)){
               return interaction.reply({embeds: [
                   new MessageEmbed()
                   .setAuthor({name: `Missing permissions`})
                   .setDescription(`You dont have enough permissions to run this command!`)
               ]})
           }
            if(exists === null){
                interaction.reply({embeds: [
                    new MessageEmbed()
                    .setAuthor({name: `Not in shop`})
                    .setDescription(`\`${item}\` does not exist!`)
                    .setColor(`#ff3067`)
                ]})
            } else if (exists.stock === undefined){
                interaction.reply({embeds: [
                    new MessageEmbed()
                    .setAuthor({name: `Item removed`})
                    .setDescription(`\`${item}\` has been removed from the shop! It contained the role <@&${exists.role}> and was bought with \`${exists.price}\` <:tedollar:987097348305997847> tedollars. It had a description of \`${exists.description}\`.`)
                    .setColor(`#ff3067`)
                ]})
                await ShopItems.deleteOne({}, {name: `${item}`})
                removeshoplog()

            } else {
                interaction.reply({embeds: [
                    new MessageEmbed()
                    .setAuthor({name: `Item removed`})
                    .setDescription(`\`${item}\` has been removed from the shop! It contained the role <@&${exists.role}> and was bought with \`${exists.price}\` <:tedollar:987097348305997847> tedollars. It had a description of \`${exists.description}\` and had \`${exists.stock}\` remaining stock.`)
                    .setColor(`#ff3067`)
                ]})
                await ShopItems.deleteOne({}, {name: `${item}`})
                removeshoplog()
            }
        }
    }
}

