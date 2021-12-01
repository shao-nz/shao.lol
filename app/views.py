from app import app

@app.route("/")
def index():
    # return render_template("index.html")
    return "this is the index page"