const { mongoose } = require('mongoose')

const AllRestarts = new mongoose.Schema({
        restarts: 'Number',
        allguilds: 'Array',
        pages: `Number`
})

const RestartsModel = mongoose.model('AllRestarts', AllRestarts)

module.exports = RestartsModel