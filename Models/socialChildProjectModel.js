const mongoose = require('mongoose');

const socialChildProjectSchema = new mongoose.Schema({

    data_obj: {
        type: Object
    }
});

const SocialChildProject = mongoose.model('SocialChildProject', socialChildProjectSchema);

module.exports = SocialChildProject;
