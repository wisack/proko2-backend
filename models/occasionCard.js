const mongoose = require('mongoose')
const occasionCardSchema = mongoose.Schema({
    vuosi: {type: Number, required: true},
    otsikko: String,
    aiheet: [{
        original_id: { type: mongoose.Schema.Types.ObjectId },        
        alaotsikko: String,
        aiheet: [{
            original_id: { type: mongoose.Schema.Types.ObjectId },
            aihe: String,
            ohje: String
        }]
    }]
})

occasionCardSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()

        for(let topic of returnedObject.aiheet){
            topic.id = topic._id.toString()
            delete topic._id;

            if(topic.original_id){
                topic.original_id = topic.original_id.toString()
            }

            for(let task of topic.aiheet){
                task.id = task._id.toString()
                delete task._id

                if(task.original_id){
                    task.original_id = task.original_id.toString()
                }
            }
        }
        
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('OccasionCard', occasionCardSchema)
