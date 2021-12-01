from flask.templating import render_template
from app import app

@app.route("/")
def home():
    # return render_template("index.html")
    return "this is the index page"

@app.route("/template")
def template():
    return render_template("index.html")