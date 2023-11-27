var mongoose = require('mongoose');
const reminderSchema = require('../model/reminder');

reminderSchema.statics = {
    create: function (data) {
        var reminder = new this(data);
        return reminder.save();
    },

    get: function (query) {
        return this.find(query);
    },

    update: function (query, updateData) {
        return this.findOneAndUpdate(query, { $set: updateData }, { new: true });
    },

    delete: function (query) {
        return this.deleteOne(query);
    },
};

var reminder = mongoose.model('reminder', reminderSchema);
module.exports = reminder;
