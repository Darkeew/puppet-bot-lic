const { mongoose } = require('mongoose')

const Settings = new mongoose.Schema({
        blacklist: {
                allowedchannels: {
                        channel: `String`,
                        commands: `Array`
                }
        },
        channel: `String`
})

const SettingsModel = mongoose.model('Settings', Settings)

module.exports = SettingsModel