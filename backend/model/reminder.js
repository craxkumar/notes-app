var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var reminderSchema = new Schema(
    {
        title: {
            type: String,
            unique: false,
            required: true,
        },
        description: {
            type: String,
            unique: false,
            required: false,
        },
        user_id: {
            type: String,
            unique: false,
            required: false,
        },
        expired: {
            type: Boolean,
            default: false,
        },
        date: {
            type: Date,
            required: true,
            default: Date.now,
            validate: {
                validator: function (date) {
                    return date > new Date(); // Validation example: date should be in the future
                },
                message: 'Date must be in the future.',
            },
        },
    },
    {
        timestamps: true,
    },
);

// Add separate indexes on the user_id, expired and date fields
reminderSchema.index({ user_id: 1 });
reminderSchema.index({ expired: 1 });
reminderSchema.index({ date: 1 });


module.exports = reminderSchema;
