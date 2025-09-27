from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Database configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///skills.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# Skill model with AI category
class SkillGoal(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    skill_name = db.Column(db.String(100), nullable=False)
    resource_type = db.Column(db.String(50), nullable=False)
    platform = db.Column(db.String(50), nullable=False)
    progress = db.Column(db.String(20), default='started')  # started/in-progress/completed
    hours_spent = db.Column(db.Float, default=0)
    notes = db.Column(db.Text, default='')
    difficulty_rating = db.Column(db.Integer, default=1)
    category = db.Column(db.String(50), default='General')  # AI-categorized skill

# Simple AI categorization function
def categorize_skill(skill_name, notes):
    text = f"{skill_name} {notes}".lower()
    if any(keyword in text for keyword in ['python', 'java', 'c++', 'programming']):
        return 'Programming'
    elif any(keyword in text for keyword in ['html', 'css', 'react', 'javascript', 'web']):
        return 'Web Development'
    elif any(keyword in text for keyword in ['ml', 'ai', 'machine learning', 'deep learning', 'tensorflow']):
        return 'AI/ML'
    else:
        return 'General'

# Get all skills
@app.route('/skills', methods=['GET'])
def get_skills():
    skills = SkillGoal.query.all()
    return jsonify([{
        'id': s.id,
        'skill_name': s.skill_name,
        'resource_type': s.resource_type,
        'platform': s.platform,
        'progress': s.progress,
        'hours_spent': s.hours_spent,
        'notes': s.notes,
        'difficulty_rating': s.difficulty_rating,
        'category': s.category
    } for s in skills])

# Add a new skill with AI category
@app.route('/skills', methods=['POST'])
def add_skill():
    data = request.json
    category = categorize_skill(data['skill_name'], data.get('notes', ''))
    
    new_skill = SkillGoal(
        skill_name=data['skill_name'],
        resource_type=data['resource_type'],
        platform=data['platform'],
        progress=data.get('progress', 'started'),
        hours_spent=data.get('hours_spent', 0),
        notes=data.get('notes', ''),
        difficulty_rating=data.get('difficulty_rating', 1),
        category=category
    )
    
    db.session.add(new_skill)
    db.session.commit()
    return jsonify({'message': 'Skill added successfully!', 'category': category})

# Dashboard
@app.route('/dashboard', methods=['GET'])
def dashboard():
    skills = SkillGoal.query.all()
    total_skills = len(skills)
    total_hours = sum(s.hours_spent for s in skills)

    progress_count = {'started':0, 'in-progress':0, 'completed':0}
    category_count = {}
    platform_count = {}

    for s in skills:
        if s.progress in progress_count:
            progress_count[s.progress] += 1
        category_count[s.category] = category_count.get(s.category, 0) + 1
        platform_count[s.platform] = platform_count.get(s.platform, 0) + 1

    return jsonify({
        'total_skills': total_skills,
        'total_hours_spent': total_hours,
        'progress_count': progress_count,
        'category_count': category_count,
        'platform_count': platform_count
    })

if __name__ == '__main__':
    db.create_all()
    app.run(debug=True)
