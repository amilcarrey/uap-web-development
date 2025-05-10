
from flask import Flask, render_template, request, redirect, url_for

app = Flask(__name__)

tasks = [
    {"text": "Personal Work No. 1", "completed": True},
    {"text": "Personal Work No. 2", "completed": False},
    {"text": "Personal Work No. 3", "completed": False},
    {"text": "Personal Work No. 4", "completed": True},
    {"text": "Personal Work No. 5", "completed": False},
]

@app.route('/')
def index():
    return render_template('tarea 4.html', tasks=tasks)

@app.route('/task-1', methods=['POST'])
@app.route('/task-2', methods=['POST'])
def add_task():
    
    new_task = request.form.get('task', '').strip()
    
    if not new_task:
        new_task = "New Task" 
    
    tasks.append({"text": new_task, "completed": False})
    return redirect(url_for('index'))

@app.route('/clear-completed', methods=['POST'])
def clear_completed():
    global tasks
    tasks = [task for task in tasks if not task["completed"]]
    return redirect(url_for('index'))

@app.route('/toggle-completed/<int:task_index>', methods=['POST'])
def toggle_completed(task_index):
    tasks[task_index]["completed"] = not tasks[task_index]["completed"]
    return redirect(url_for('index'))

@app.route('/delete-task/<int:task_index>', methods=['POST'])
def delete_task(task_index):
    tasks.pop(task_index)  
    return redirect(url_for('index'))

@app.route('/filter/<filter_type>')
def filter_tasks(filter_type):
    if filter_type == "active":
        filtered_tasks = [task for task in tasks if not task["completed"]]
    elif filter_type == "completed":
        filtered_tasks = [task for task in tasks if task["completed"]]
    else:  
        filtered_tasks = tasks
    return render_template('tarea 4.html', tasks=filtered_tasks)

if __name__ == '__main__':
    app.run(debug=True)