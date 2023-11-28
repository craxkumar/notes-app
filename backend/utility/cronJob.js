const cron = require('node-cron');

const cronJob = () => {
    cron.schedule('*/10 * * * * *', () => {
        console.log('Cron job running every 10 seconds');
        // Add your logic here
    });
};

module.exports = cronJob;
