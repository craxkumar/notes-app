var mongoose = require("mongoose");
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
        message: "Date must be in the future.",
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = reminderSchema;
