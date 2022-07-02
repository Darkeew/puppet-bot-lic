const { mongoose } = require('mongoose')

const Economy_Checker = new mongoose.Schema({
            user: `String`,
            balance: `Number`,
            inventory: `Array`,
            ask_cooldown: `Number`,
            daily_cooldown: `Number`,
            daily_streak: `Number`,
            daily_last_claimed: `Number`,
            claimed_level_5: `Boolean`,
            claimed_level_10: `Boolean`,
            claimed_level_20: `Boolean`,
            claimed_level_30: `Boolean`,
            claimed_level_40: `Boolean`,
            claimed_level_50: `Boolean`,
            claimed_level_75: `Boolean`,
            claimed_level_100: `Boolean`,
})

const EconomyChecker = mongoose.model('Economy_Checker', Economy_Checker)

module.exports = EconomyChecker