const { CommandInteraction, MessageEmbed } = require("discord.js");

module.exports = {
    name: 'staff-list',
    description: 'Shows the current staff and their positions as a staff.',
    permission: 'SEND_MESSAGES',
    /**
     * @param {CommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {
        const list = client.guilds.cache.get(`986357448925401168`)
        await list.members.fetch()
        //add the dumb settings stuff

        //check for trainees
        if(list.roles.cache.get(`986600882810544138`).members.size === 0) {
            global.trainees = `There is currently no staff member in the position of \`Trainee Moderator\`.`
        } else {
        global.trainees = list.roles.cache.get(`986600882810544138`).members.map((m) => {
            if(m.presence === null){
                return `<:offline:989591896521338971> <@!${m.user.id}> `
            } else if (m.presence.status === `online`){
                return `<:online:989591925407481857> <@!${m.user.id}> `
            } else if (m.presence.status === `dnd`){
                return `<:dnd:989591866213290004> <@!${m.user.id}> `
            } else if (m.presence.status === `idle`){
                return `<:idle:989591949994491934> <@!${m.user.id}> `
            }
        })
        }

        //check for mods
        if(list.roles.cache.get(`946524686429347880`).members.size === 0){
            global.mods = `There is currently no staff member in the position of \`Moderator\`.`
        } else {
        global.mods = list.roles.cache.get(`946524686429347880`).members.map((m) => {
            if(m.presence === null){
                return `<:offline:989591896521338971> <@!${m.user.id}> `
            } else if (m.presence.status === `online`){
                return `<:online:989591925407481857> <@!${m.user.id}> `
            } else if (m.presence.status === `dnd`){
                return `<:dnd:989591866213290004> <@!${m.user.id}> `
            } else if (m.presence.status === `idle`){
                return `<:idle:989591949994491934> <@!${m.user.id}> `
            }
        })
        }

        //check for admins
        if(list.roles.cache.get(`946524775994507264`).members.size === 0){
            global.admins = `There is currently no staff member in the position of \`Admin\`.`
        } else {
        global.admins = list.roles.cache.get(`946524775994507264`).members.map((m) => {
            if(m.presence === null){
                return `<:offline:989591896521338971> <@!${m.user.id}> `
            } else if (m.presence.status === `online`){
                return `<:online:989591925407481857> <@!${m.user.id}> `
            } else if (m.presence.status === `dnd`){
                return `<:dnd:989591866213290004> <@!${m.user.id}> `
            } else if (m.presence.status === `idle`){
                return `<:idle:989591949994491934> <@!${m.user.id}> `
            }
        })
        }

        //check for owners
        if(list.roles.cache.get(`946524960082493440`).members.size === 0){
            global.owners = `There is currently no staff member in the position of \`Owner\`.`
        } else {
        global.owners = list.roles.cache.get(`946524960082493440`).members.map((m) => {
            if(m.presence === null){
                return `<:offline:989591896521338971> <@!${m.user.id}> `
            } else if (m.presence.status === `online`){
                return `<:online:989591925407481857> <@!${m.user.id}> `
            } else if (m.presence.status === `dnd`){
                return `<:dnd:989591866213290004> <@!${m.user.id}> `
            } else if (m.presence.status === `idle`){
                return `<:idle:989591949994491934> <@!${m.user.id}> `
            }
        })
        }
        interaction.reply({embeds: [
            new MessageEmbed()
            .setAuthor({name: `Staff List`})
            .setDescription(`
Here are the current staff members, their position, and their status:

**Owners:**
${owners.toString().replace(`,`, ` `)}

**Admins:**
${admins.toString().replace(`,`, ` `)}

**Moderators:**
${mods.toString().replace(`,`, ` `)}

**Trainee Moderators:**
${trainees.toString().replace(`,`, ` `)}
            `)
            .setColor(`#ff3067`)
            .setThumbnail(`https://d.furaffinity.net/art/vupiqueen/1655236864/1655236864.vupiqueen_fqx0vb5x0ain_mn.png`)
            .setTimestamp()
        ]})
    }
}

