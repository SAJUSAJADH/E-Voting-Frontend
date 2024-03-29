from flask import Flask, jsonify, request, Response
from flask_cors import CORS

app = Flask(__name__)
CORS(app)


    
@app.route('/api/hello')
def hello():
    return '<p>Hello from Flask!</p>'

@app.route('/api/data')
def get_data():
    return jsonify({'message': 'Hello from Flask!'})


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')