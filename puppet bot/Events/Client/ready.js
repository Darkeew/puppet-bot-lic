const { Client, Guild } = require("discord.js")
const mongoose = require("mongoose")
const { db_credentials } = require('../../Structures/config.json')

module.exports = {
    name: 'ready',
    once: true,
    /**
    * @param {Client} client
    * @param {Guild} guild
    */
    async execute(client) {
        console.log('Puppet bot is online!')
        client.user.setActivity('neco arc stumble to death.', {type: 'WATCHING'})

        const URI = db_credentials 
        const URIParams = {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }
            mongoose.connect(URI, URIParams, err => {
                
                if (err) console.log('⚠ Couldnt connect to Puppet Database, ' + err)
                else console.log(`🔘 Successfully connected to Puppet Database.`)
            
            }
        )
       const RestartsModel = require('../../Structures/Schema/Restarts.js')
       const current_restarts = await RestartsModel.findOne({owner: 'Darkeew'})
       if (!current_restarts){
           await RestartsModel.create({restarts: '1', allguilds: client.guilds.cache.map(guild => guild.id)})
           return
       } else {
           current_restarts.restarts++
           await current_restarts.save()
       }
    }
}