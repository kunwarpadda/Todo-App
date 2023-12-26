from flask import Flask, render_template, request, redirect, session
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from flask import jsonify

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:///test.db"
db = SQLAlchemy(app)

class Todo(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    date_created = db.Column(db.Date, default=datetime.utcnow)
    task = db.Column(db.String(80), nullable=False)
    checked = db.Column(db.Boolean)
    
    def __repr__(self):
        return '<task %r>' % self.task

@app.route("/", methods=["POST","GET"])

def index():
    if request.method == "POST":
        
        task = request.form["task_info"]
        new_task = Todo(task=task)
        
        db.session.add(new_task)
        db.session.commit()
        return redirect('/')
        
    else:
        tasks = Todo.query.order_by(Todo.date_created).all()
        return render_template("index.html", tasks=tasks, last_index=len(tasks)-1, length=len(tasks))


@app.route("/update/<int:id>", methods=["POST", "GET"])
def update(id):
    task_to_update = Todo.query.get_or_404(id)
    
    if request.method == "POST":
        try:
            task_to_update.task = request.form['task_info']
            db.session.commit()
            return jsonify({'message': 'Task updated successfully'})
        except Exception as e:
            print(f"Error updating task: {str(e)}")
            return jsonify({'error': 'Internal Server Error'}), 500
    else:
        return render_template("index.html")
    
@app.route("/delete/<int:id>", methods=["GET"])

def delete(id):
    
    task_to_delete = Todo.query.get_or_404(id)
    
    try:
        db.session.delete(task_to_delete)
        db.session.commit()
        return redirect('/')
    
    except:
        return "Something wrong with deleting the task"

@app.route("/checked/<int:id>", methods=["POST","GET"])

def checkbox(id):
    
    task = Todo.query.get_or_404(id)
    
    task.checked = not task.checked 
    
    db.session.commit()
    return redirect('/')


if __name__ == "__main__":
    app.run(debug=True)