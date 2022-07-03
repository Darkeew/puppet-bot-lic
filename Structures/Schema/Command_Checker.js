const { mongoose } = require('mongoose')

const Command_Checker = new mongoose.Schema({
            user: `String`,
            asks: `Number`,
            rejected_asks: `Number`,
            accepted_asks: `Number`,
            dailies: `Number`,
            hugs: `Number`,
            self_hug: `Number`,
            bot_hug: `Number`,
            ping: `Number`,
            items_bought: `Number`,
            money_wasted: `Number`,
            balance_checked: `Number`,
            other_balance_checked: `Number`,
            tedollars_given: `Number`,
            tedollars_gotten: `Number`,
            tedollers_taken: `Number`,
            tedollars_removed: `Number`,
            help: `Number`,
            hugged: `Number`,
})

const CommandModel = mongoose.model('Command_Checker', Command_Checker)

module.exports = CommandModel