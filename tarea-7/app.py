# app.py
from flask import Flask, render_template, request, jsonify
import json
import os
import uuid
from collections import defaultdict

basedir = os.path.abspath(os.path.dirname(__file__))
react_build_folder = os.path.join(basedir, 'dist_react')
traditional_static_folder = os.path.join(basedir, 'static')

app = Flask(__name__, static_folder=traditional_static_folder, template_folder=react_build_folder)

# --- Archivo para la persistencia ---
DATA_FILE = os.path.join(basedir, 'data.json')

# Inicialización de la estructura de datos
# boards: diccionario de tableros
# global_config: diccionario para configuraciones globales
app_data = {
    "boards": defaultdict(lambda: {"name": "Unnamed Board", "tasks": []}),
    "global_config": {
        "refetch_interval": 10000, # Por defecto: 10 segundos en milisegundos
        "uppercase_description": False # Por defecto: falso
    }
}

def load_data():
    global app_data
    if os.path.exists(DATA_FILE):
        with open(DATA_FILE, 'r') as f:
            try:
                loaded_full_data = json.load(f)

                # Cargar tableros
                boards_loaded = {}
                for board_id, board_data in loaded_full_data.get("boards", {}).items():
                    boards_loaded[board_id] = {
                        "name": board_data.get("name", "Unnamed Board"),
                        "tasks": [
                            {"id": str(task.get("id", str(uuid.uuid4()))), "text": task.get("text", ""), "completed": task.get("completed", False)}
                            for task in board_data.get("tasks", [])
                        ]
                    }
                app_data["boards"] = defaultdict(lambda: {"name": "Unnamed Board", "tasks": []}, boards_loaded)

                # Cargar configuración global, usando valores por defecto si no existen
                app_data["global_config"] = {
                    "refetch_interval": loaded_full_data.get("global_config", {}).get("refetch_interval", 10000),
                    "uppercase_description": loaded_full_data.get("global_config", {}).get("uppercase_description", False)
                }

            except json.JSONDecodeError:
                print("Error loading data.json. Starting with empty data.")
                app_data["boards"] = defaultdict(lambda: {"name": "Unnamed Board", "tasks": []})
                app_data["global_config"] = {"refetch_interval": 10000, "uppercase_description": False} # Reset config
    else:
        print("data.json not found. Starting with empty data.")
        app_data["boards"] = defaultdict(lambda: {"name": "Unnamed Board", "tasks": []})
        app_data["global_config"] = {"refetch_interval": 10000, "uppercase_description": False} # Reset config


    # Si no hay tableros, crea uno por defecto para empezar
    if not app_data["boards"]:
        default_board_id = str(uuid.uuid4())
        app_data["boards"][default_board_id] = {
            "name": "Mi Primer Tablero",
            "tasks": [
                {"id": str(uuid.uuid4()), "text": "Bienvenido a tu primer tablero", "completed": False},
                {"id": str(uuid.uuid4()), "text": "Haz click en 'Editar' para cambiar esta tarea", "completed": False},
                {"id": str(uuid.uuid4()), "text": "Usa 'Eliminar' para borrarla", "completed": False},
                {"id": str(uuid.uuid4()), "text": "Crea más tareas con el formulario de arriba", "completed": True},
                {"id": str(uuid.uuid4()), "text": "Explora la paginación para ver más tareas", "completed": False},
                {"id": str(uuid.uuid4()), "text": "¡Disfruta organizando tus ideas!", "completed": False},
            ]
        }
        save_data() # Guarda el tablero por defecto

def save_data():
    with open(DATA_FILE, 'w') as f:
        # Convertir defaultdict a dict antes de guardar para JSON
        serializable_data = {
            "boards": dict(app_data["boards"]),
            "global_config": app_data["global_config"]
        }
        json.dump(serializable_data, f, indent=4)

# Cargar los datos al iniciar la aplicación
load_data()

# --- Rutas de Archivos Estáticos y React ---
@app.route('/')
def serve_react_app():
    return render_template('index.html')

# Maneja las rutas específicas de React para que el router de React se encargue
@app.route('/boards/<path:path>')
def serve_react_boards(path):
    return render_template('index.html')

# Nueva ruta para las configuraciones
@app.route('/settings')
def serve_react_settings():
    return render_template('index.html')


# --- ENDPOINTS PARA GESTIONAR TABLEROS ---
@app.route('/api/boards', methods=['GET'])
def get_boards():
    # Devuelve una lista de diccionarios con id y nombre de cada tablero
    return jsonify([{"id": board_id, "name": app_data["boards"][board_id]["name"]} for board_id in app_data["boards"]])

@app.route('/api/boards', methods=['POST'])
def create_board():
    if request.is_json:
        data = request.get_json()
        board_name = data.get('name', 'Nuevo Tablero').strip()
        new_board_id = str(uuid.uuid4())
        app_data["boards"][new_board_id] = {"name": board_name, "tasks": []}
        save_data()
        return jsonify({"status": "success", "board": {"id": new_board_id, "name": board_name}, "message": "Board created"}), 201
    return jsonify({"status": "error", "message": "Invalid request type"}), 400

@app.route('/api/boards/<string:board_id>', methods=['DELETE'])
def delete_board(board_id):
    if board_id in app_data["boards"]:
        del app_data["boards"][board_id]
        save_data()
        return jsonify({"status": "success", "message": "Board deleted"}), 200
    return jsonify({"status": "error", "message": "Board not found"}), 404

# --- ENDPOINTS PARA TAREAS (AHORA REQUIEREN board_id) ---

@app.route('/api/boards/<string:board_id>/tasks', methods=['GET'])
def get_tasks(board_id):
    if board_id not in app_data["boards"]:
        return jsonify({"status": "error", "message": "Board not found"}), 404

    current_tasks = app_data["boards"][board_id]["tasks"]

    filter_type = request.args.get("filter", "all")
    page = request.args.get("page", 1, type=int)
    limit = request.args.get("limit", 5, type=int)

    if filter_type == "active":
        filtered_tasks = [task for task in current_tasks if not task["completed"]]
    elif filter_type == "completed":
        filtered_tasks = [task for task in current_tasks if task["completed"]]
    else:
        filtered_tasks = current_tasks

    total_tasks = len(filtered_tasks)
    start_index = (page - 1) * limit
    end_index = start_index + limit
    paginated_tasks = filtered_tasks[start_index:end_index]

    return jsonify({
        "tasks": paginated_tasks,
        "total": total_tasks,
        "page": page,
        "limit": limit
    })


@app.route('/api/boards/<string:board_id>/tasks', methods=['POST'])
def add_task_api(board_id):
    if board_id not in app_data["boards"]:
        return jsonify({"status": "error", "message": "Board not found"}), 404

    if request.is_json:
        try:
            data = request.get_json()
            new_task_text = data.get('task', '').strip()
            if not new_task_text:
                new_task_text = "New Task"
            new_task = {"id": str(uuid.uuid4()), "text": new_task_text, "completed": False}
            app_data["boards"][board_id]["tasks"].append(new_task)
            save_data() # Guarda los datos después de cada cambio
            return jsonify({"status": "success", "task": new_task, "message": "Task added successfully"}), 201
        except (json.JSONDecodeError, AttributeError):
            return jsonify({"status": "error", "message": "Invalid JSON payload"}), 400
    return jsonify({"status": "error", "message": "Invalid request type"}), 400

@app.route('/api/boards/<string:board_id>/tasks/clear-completed', methods=['POST'])
def clear_completed_api(board_id):
    if board_id not in app_data["boards"]:
        return jsonify({"status": "error", "message": "Board not found"}), 404

    app_data["boards"][board_id]["tasks"] = [task for task in app_data["boards"][board_id]["tasks"] if not task["completed"]]
    save_data()
    return jsonify({"status": "success", "message": "Completed tasks cleared"})

@app.route('/api/boards/<string:board_id>/tasks/toggle-completed/<string:task_id>', methods=['POST'])
def toggle_completed_api(board_id, task_id):
    if board_id not in app_data["boards"]:
        return jsonify({"status": "error", "message": "Board not found"}), 404

    for task in app_data["boards"][board_id]["tasks"]:
        if task["id"] == task_id:
            task["completed"] = not task["completed"]
            save_data()
            return jsonify({"status": "success", "message": "Task completion toggled"}), 200
    return jsonify({"status": "error", "message": "Task not found"}), 404

@app.route('/api/boards/<string:board_id>/tasks/<string:task_id>', methods=['PUT'])
def update_task_api(board_id, task_id):
    if board_id not in app_data["boards"]:
        return jsonify({"status": "error", "message": "Board not found"}), 404

    if request.is_json:
        try:
            data = request.get_json()
            updated_text = data.get('text', '').strip()
            updated_completed = data.get('completed', False)

            if not updated_text:
                return jsonify({"status": "error", "message": "Task text cannot be empty"}), 400

            for task in app_data["boards"][board_id]["tasks"]:
                if task["id"] == task_id:
                    task["text"] = updated_text
                    task["completed"] = updated_completed
                    save_data()
                    return jsonify({"status": "success", "task": task, "message": "Task updated successfully"}), 200
            return jsonify({"status": "error", "message": "Task not found"}), 404
        except (json.JSONDecodeError, AttributeError):
            return jsonify({
                "status": "error",
                "message": "Invalid JSON payload"
            }), 400
    return jsonify({"status": "error", "message": "Invalid request type"}), 400


@app.route('/api/boards/<string:board_id>/tasks/delete-task/<string:task_id>', methods=['DELETE'])
def delete_task_api(board_id, task_id):
    if board_id not in app_data["boards"]:
        return jsonify({"status": "error", "message": "Board not found"}), 404

    initial_len = len(app_data["boards"][board_id]["tasks"])
    app_data["boards"][board_id]["tasks"] = [task for task in app_data["boards"][board_id]["tasks"] if task["id"] != task_id]
    if len(app_data["boards"][board_id]["tasks"]) < initial_len:
        save_data()
        return jsonify({"status": "success", "message": "Task deleted"}), 200
    return jsonify({"status": "error", "message": "Task not found"}), 404

# --- NUEVOS ENDPOINTS PARA CONFIGURACIONES GLOBALES ---
@app.route('/api/config', methods=['GET'])
def get_global_config():
    return jsonify(app_data["global_config"])

@app.route('/api/config', methods=['PUT'])
def update_global_config():
    if request.is_json:
        try:
            data = request.get_json()
            # Actualiza solo las claves que existen en la config por defecto
            for key in app_data["global_config"]:
                if key in data:
                    app_data["global_config"][key] = data[key]
            save_data()
            return jsonify({"status": "success", "message": "Configuration updated", "config": app_data["global_config"]}), 200
        except (json.JSONDecodeError, AttributeError):
            return jsonify({"status": "error", "message": "Invalid JSON payload"}), 400
    return jsonify({"status": "error", "message": "Invalid request type"}), 400


@app.errorhandler(404)
def not_found(e):
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)