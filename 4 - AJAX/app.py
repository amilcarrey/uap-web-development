from flask import Flask, render_template, request, redirect, url_for, jsonify

app = Flask(__name__)

# Base de datos simulada en memoria
tasks = []

@app.route("/")
def index():
    filter_status = request.args.get("filter", "all")
    if filter_status == "completed":
        filtered_tasks = [t for t in tasks if t['completed']]
    elif filter_status == "incomplete":
        filtered_tasks = [t for t in tasks if not t['completed']]
    else:
        filtered_tasks = tasks
    return render_template("index.html", tasks=filtered_tasks, current_filter=filter_status)

@app.route("/add", methods=["POST"])
def add():
    text = request.form.get("task") or (request.json.get("task") if request.is_json else None)
    if text:
        new_task = {"id": len(tasks)+1, "text": text, "completed": False}
        tasks.append(new_task)
        if request.is_json:
            return jsonify(new_task)
    return redirect(url_for("index"))

@app.route("/toggle/<int:task_id>", methods=["POST"])
def toggle(task_id):
    for t in tasks:
        if t["id"] == task_id:
            t["completed"] = not t["completed"]
            if request.is_json:
                return jsonify({"id": t["id"], "completed": t["completed"]})
            break
    return redirect(url_for("index"))

@app.route("/delete/<int:task_id>", methods=["POST"])
def delete(task_id):
    global tasks
    tasks = [t for t in tasks if t["id"] != task_id]
    if request.is_json:
        return jsonify({"deleted": task_id})
    return redirect(url_for("index"))

@app.route("/clear_completed", methods=["POST"])
def clear_completed():
    global tasks
    tasks = [t for t in tasks if not t["completed"]]
    if request.is_json:
        return jsonify({"cleared": True})
    return redirect(url_for("index"))

if __name__ == "__main__":
    app.run(debug=True)
