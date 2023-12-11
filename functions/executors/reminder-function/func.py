from flask import Flask, request, jsonify
import requests
from pymongo import MongoClient
from bson import ObjectId

app = Flask(__name__)

def update_reminder_as_expired(reminder_data):
    try:
        print('hello')
        # Connect to the MongoDB database
        client = MongoClient('mongodb://localhost:27017/')
        db = client['notes']
        reminders_collection = db['reminders']

        # Update the reminder to mark it as expired
        query = {'_id': ObjectId(reminder_data['_id'])}
        update = {'$set': {'expired': True}}

        result = reminders_collection.update_one(query, update)

        if result.modified_count > 0:
            print(f'Reminder with _id {reminder_data["_id"]} updated as expired')
        else:
            print(f'No reminder with _id {reminder_data["_id"]} found')

    except Exception as e:
        print('Error updating reminder as expired:', str(e))
    finally:
        # Close the MongoDB connection
        client.close()

@app.route('/',methods=['GET'])
def hello():
    return "hello world"


# Endpoint to process reminders
@app.route('/process', methods=['POST'])
def process_reminder():
    try:
        print("hiiiiiii")
        print(request.json.get('reminder'))
        reminder = request.json.get('reminder', [])
        print(reminder)
        # for reminder_data in reminders:
            # Perform custom processing logic here
            # For example, you might want to save the reminder to a database
            # or perform additional actions based on the reminder details.

            # Example: Update the reminder to mark it as expired
        update_reminder_as_expired(reminder)

            # Make a call to another service with the processed data
            # send_to_go_service(reminder_data)
        print('Reminder processed successfully:', reminder)

        return jsonify({'message': 'Reminders processed successfully'}), 200
    except Exception as e:
        print('Error processing reminders:', str(e))
        return jsonify({'error': 'Internal Server Error'}), 500

# def send_to_go_service(reminder_data):
#     try:
#         # Make a POST request to the Go service
#         response = requests.post('http://localhost:5004/process', json=reminder_data)
#         response.raise_for_status()
#         print('Sent data to Go service successfully:', response.json())
#     except requests.exceptions.RequestException as e:
#         print('Error sending data to Go service:', str(e))

if __name__ == '__main__':
    # Start the processor on port 5002
    app.run(host='0.0.0.0', port=5002)
