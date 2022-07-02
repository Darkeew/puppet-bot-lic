const { Perms } = require('../Validation/Permissions')
const { Client } = require('discord.js')

/**
 * @param {Client} client
 */
module.exports = async (client, PG, Ascii) => {
    const Table = new Ascii('💮 Commands:')
    
    CommandsArray = [];

    (await PG(`${process.cwd()}/Commands/**/*.js`)).map(async (file) => {
        const command = require(file)

        if(!command.name)
        return Table.addRow(file.split('/')[7], 'FAILED', '❌ Failed to find a name.')

        if(!command.contex && !command.description){
        return Table.addRow(command.name, 'FAILED', '❌ Failed to find a description.')
        }

        if(!command.permission) {
            if(Perms.includes(command.permission))
            command.defaultPermission = false;
            else
            return Table.addRow(command.name, 'FAILED', '❌ Bot doesnt have enough permissions.')
        }

        client.commands.set(command.name, command)
        CommandsArray.push(command)
        
        await Table.addRow(command.name, '✔ Command loaded successfully.')
    })

    console.log(Table.toString())

    // PERMISSIONS CHECK //

    client.on('ready', async () => {
        client.guilds.cache.forEach((g) => {
            g.commands.set(CommandsArray);
        });
    });
}