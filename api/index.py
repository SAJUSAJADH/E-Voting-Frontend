from flask import Flask, jsonify, request, Response
from flask_cors import CORS
from data_collection import Collect_data
from training import Train_model
from detect import Detect_face

app = Flask(__name__)
CORS(app)


    
@app.route('/api/hello')
def hello():
    return '<p>Hello from Flask!</p>'

@app.route('/api/data')
def get_data():
    return jsonify({'message': 'Hello from Flask!'})

@app.route('/api/enroll_face', methods=['POST'])
def collect_data_and_train():
    try:
        Collect_data()
        id=Train_model()
        if id is not None:
            return jsonify({'message': 'Enrollment success', 'userId': id})
        else:
            return jsonify({'message': 'Enrollment failed'})
    except:
        return jsonify({'message': 'Enrollment failed'})

@app.route('/api/detect_face', methods=['POST'])
def detect_face():
    user_id = request.form.get('userId')
    if user_id is None:
        return jsonify({'message': 'User ID not provided'}), 400
    try:
        id=Detect_face()
        if user_id==id:
            return jsonify({'message': 'Face detection success', 'userId': id})
        else:
            return jsonify({'message': 'Face detection failed'})
    except:
        return jsonify({'message': 'Face detection failed'})




if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')