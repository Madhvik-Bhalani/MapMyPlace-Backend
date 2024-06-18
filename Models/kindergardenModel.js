const mongoose = require('mongoose');

const kindergartenSchema = new mongoose.Schema({

    data_obj: {
        type: Object
    }
}
);

const Kindergarden = mongoose.model('Kindergarten', kindergartenSchema);

module.exports = Kindergarden;
