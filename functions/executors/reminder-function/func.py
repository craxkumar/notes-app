from flask import Flask, request, jsonify
from pymongo import MongoClient, UpdateOne
from bson import ObjectId

app = Flask(__name__)

def update_reminders_as_expired(reminder_data_list):
    try:
        client = MongoClient('mongodb://localhost:27017/')
        db = client['notes']
        reminders_collection = db['reminders']

        update_operations = []
        for reminder_data in reminder_data_list:
            query = {'_id': ObjectId(reminder_data['_id'])}
            update_operations.append(UpdateOne(query, {'$set': {'expired': True}}))

        result = reminders_collection.bulk_write(update_operations)

        print(f'{result.modified_count} reminders updated as expired')

    except Exception as e:
        print('Error updating reminders as expired:', str(e))
    finally:
        client.close()

@app.route('/',methods=['GET'])
def hello():
    return "hello world"

@app.route('/process', methods=['POST'])
def process_reminder():
    try:
        reminders = request.json.get('reminder', [])
        update_reminders_as_expired(reminders)

        for reminder in reminders:
            reminder['expired'] = True


        api_url = 'http://localhost:3001/emitter'
        response = requests.post(api_url, jsonify(reminders))

        if response.status_code == 200:
            print('Reminders processed successfully')
            return jsonify(reminders), 200
        else:
            print(f'Error processing reminders. Status code: {response.status_code}')
            return jsonify({'error': 'Internal Server Error'}), 500

    except Exception as e:
        print('Error processing reminders:', str(e))
        return jsonify({'error': 'Internal Server Error'}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5002)
