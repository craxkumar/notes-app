const cron = require('node-cron');

const cronJob = () => {
    cron.schedule('*/10 * * * * *', async () => {
        console.log('Cron job running every 10 seconds');

        try {
            // Make a GET request to http://localhost:8080 using fetch
            const response = await fetch('http://localhost:8080');

            // Check if the response status is okay (status code 200)
            if (response.ok) {
                const data = await response.text();
                console.log('HTTP GET Response:', data);
                // Add your logic here based on the response data
            } else {
                console.error('Error making GET request. Status:', response.status);
            }
        } catch (error) {
            // Handle errors, if any
            console.error('Error making GET request:', error.message);
        }
    });
};

module.exports = cronJob;
