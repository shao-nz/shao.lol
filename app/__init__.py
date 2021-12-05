from flask import Flask

app = Flask(__name__, static_folder="static")
from app import views


# app.run(host="0.0.0.0", port=80, debug=True)
