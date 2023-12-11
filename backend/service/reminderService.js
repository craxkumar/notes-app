// const moment = require('moment');
const reminderRepository = require("../repository/reminderRepository");

/**
 * save reminder to the db
 * @param {*} req
 * @param {*} res
 */
exports.saveReminder = function (req, res) {
  const userId = req?.kauth?.grant?.access_token?.content?.sub;
  const reminder = req.body;
  console.log(req.body);
  // const combinedDateTime = moment(`${reminder.date} ${reminder.time}`, 'YYYY-MM-DD HH:mm:ss').toDate();

  // Split the time into hours, minutes, and seconds
  var [hours, minutes, seconds] = reminder.time.split(":");
  seconds = "00";
  // Create a new Date object with the specified date and time
  const combinedDateTime = new Date(
    reminder.date + "T" + hours + ":" + minutes + ":" + seconds + "Z"
  );

  reminder.date = combinedDateTime;
  reminder.user_id = userId;
  reminderRepository
    .create(reminder)
    .then((savedReminder) => {
      console.log("Reminder was added successfully!");
      return res.status(200).send(savedReminder);
    })
    .catch((error) => {
      console.error(error);
      return res.status(500).send({ message: "Error creating Reminder" });
    });
};

/**
 * Get all Reminders
 * @param {*} req
 * @param {*} res
 */
exports.getReminders = function (req, res) {
  const userId = req?.kauth?.grant?.access_token?.content?.sub;
  reminderRepository
    .get({ user_id: userId })
    .then((result) => {
      if (Array.isArray(result)) {
        console.log("Retrieved Reminders");
        return res.status(200).send(result);
      }
    })
    .catch((error) => {
      console.error("Error retrieving reminders:", error);
      return res.status(500).send({ message: "Error retrieving reminders" });
    });
};
