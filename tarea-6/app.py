from flask import Flask, render_template, request, redirect, url_for, jsonify, send_from_directory
import json
import os 

basedir = os.path.abspath(os.path.dirname(__file__))

react_build_folder = os.path.join(basedir, 'dist_react')

traditional_static_folder = os.path.join(basedir, 'static')

app = Flask(__name__, static_folder=traditional_static_folder, template_folder=react_build_folder)

tasks = [
    {"text": "Personal Work No. 1", "completed": True},
    {"text": "Personal Work No. 2", "completed": False},
    {"text": "Personal Work No. 3", "completed": False},
    {"text": "Personal Work No. 4", "completed": True},
    {"text": "Personal Work No. 5", "completed": False},
]       

# Modifica la ruta principal para servir el index.html de Vite
@app.route('/')
def serve_react_app():
    return render_template('index.html') 

@app.route('/api/tasks', methods=['GET'])
def get_tasks():
    filter_type = request.args.get("filter", "all")
    if filter_type == "active":
        filtered_tasks = [task for task in tasks if not task["completed"]]
    elif filter_type == "completed":
        filtered_tasks = [task for task in tasks if task["completed"]]
    else:
        filtered_tasks = tasks
    return jsonify(filtered_tasks) # ¡Retorna JSON directamente!

@app.route('/api/tasks', methods=['POST'])
def add_task_api():
    new_task_text = None
    if request.is_json:
        try:
            data = request.get_json()
            new_task_text = data.get('task', '').strip()
            if not new_task_text:
                new_task_text = "New Task"
            tasks.append({"text": new_task_text, "completed": False})
            return jsonify({
                "status": "success",
                "task": {"text": new_task_text, "completed": False},
                "message": "Task added successfully"
            }), 201
        except (json.JSONDecodeError, AttributeError):
            return jsonify({
                "status": "error",
                "message": "Invalid JSON payload"
            }), 400
    # Ya no necesitamos manejar la solicitud de formulario, React enviará JSON
    return jsonify({"status": "error", "message": "Invalid request type"}), 400


@app.route('/api/tasks/clear-completed', methods=['POST'])
def clear_completed_api():
    global tasks
    tasks = [task for task in tasks if not task["completed"]]
    return jsonify({"status": "success", "message": "Completed tasks cleared"})

@app.route('/api/tasks/toggle-completed/<int:task_index>', methods=['POST'])
def toggle_completed_api(task_index):
    if 0 <= task_index < len(tasks):
        tasks[task_index]["completed"] = not tasks[task_index]["completed"]
        return jsonify({"status": "success", "message": "Task completion toggled"})
    return jsonify({"status": "error", "message": "Task not found"}), 404

@app.route('/api/tasks/delete-task/<int:task_index>', methods=['DELETE']) # Cambiado a DELETE
def delete_task_api(task_index):
    if 0 <= task_index < len(tasks):
        tasks.pop(task_index)
        return jsonify({"status": "success", "message": "Task deleted"})
    return jsonify({"status": "error", "message": "Task not found"}), 404

# Para manejar cualquier otra ruta que no sea una API, redirige a la app React
@app.errorhandler(404)
def not_found(e):
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)