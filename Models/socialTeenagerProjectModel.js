const mongoose = require('mongoose');

const socialTeenagerProjectSchema = new mongoose.Schema({
    data_obj: {
        type: Object
    }
});


const SocialTeenagerProject = mongoose.model('SocialTeenagerProject', socialTeenagerProjectSchema);

module.exports = SocialTeenagerProject;
