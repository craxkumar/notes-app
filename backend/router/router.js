var reminderService = require('../service/reminderService');

module.exports = function (router) {
    router.post('/reminders', reminderService.saveReminder);
    router.get('/reminders', reminderService.getReminders);
};
