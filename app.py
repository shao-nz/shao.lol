from flask import Flask, render_template
from markupsafe import escape


app = Flask(__name__)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/projects")
def projects():
    return render_template("projects.html")

@app.route("/ipt")
def ipt():
    return render_template("ipt.html")

@app.route("/commsys")
def commsys():
    return render_template("commsys.html")

@app.route ("/ccommsys")
def ccommsys():
    return render_template("ccommsys.html")

@app.route ("/trcommsys")
def trcommsys():
    return render_template("trcommsys.html")


if __name__ == "__main_":
    app.run(host="0.0.0.0", port=80)
