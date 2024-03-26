from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
    
@app.route('/server/hello')
def hello():
    return 'Hello from Flask!'

@app.route('/server/data')
def get_data():
    return jsonify({'message': 'Hello from Flask!'})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')