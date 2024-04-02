from flask import Flask, jsonify, request
from flask_cors import CORS
from Face_reg import FaceRecognition 


app = Flask(__name__)
CORS(app)

@app.route('/api/detect_face', methods=['POST'])
def detect_face():
    data = request.json  # Assuming JSON data is sent from the frontend
    user_id = data.get('userId')
    if user_id is None:
        return jsonify({'message': 'User ID not provided'}), 400
    try:
        fr = FaceRecognition()
        result  = fr.run_recognition(user_id)
        if result == 'matched':
            return jsonify({'message': 'Face Reg Successfull'}), 200
        else:
            return jsonify({'message': 'Face Reg unSuccessfull'}), 400
    except Exception as e:
        return jsonify({'message': f'Face detection failed: {str(e)}'})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
