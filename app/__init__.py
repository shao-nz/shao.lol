from flask import Flask

app = Flask(__name__)
from app import views


# if __name__ == "__main_":
#     app.run(host="0.0.0.0", port=80)
