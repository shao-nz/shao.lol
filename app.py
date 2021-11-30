from flask import Flask, render_template
from markupsafe import escape


app = Flask(__name__)

@app.route("/")
def index():
    return render_template("index.html")


if __name__ == "__main_":
    app.run(host="0.0.0.0", port=80)
