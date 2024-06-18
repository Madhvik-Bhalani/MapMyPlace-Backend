const mongoose = require('mongoose');

const schoolSchema = new mongoose.Schema({

    data_obj: {
        type: Object
    }
});


const School = mongoose.model('School', schoolSchema);

module.exports = School;