from flask import Flask, render_template, send_from_directory


app = Flask(__name__, template_folder="templates")


@app.get("/")
def index():
    return render_template("index.html")


@app.get("/workflow_v1.tsx")
def workflow_file():
    return send_from_directory(".", "workflow_v1.tsx")


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=True)
