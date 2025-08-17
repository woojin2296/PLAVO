import Database from "better-sqlite3";
import path from "path";

const dbPath = path.join(process.cwd(), "data", "mydb.sqlite");
const db = new Database(dbPath);

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    password TEXT NOT NULL    
  );
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    due_date TEXT,
    goal_time INTEGER,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS practices (
    id TEXT PRIMARY KEY,
    user_id INTEGER NOT NULL,
    project_id TEXT NOT NULL,
    total_score INTEGER NOT NULL,
    speed_score INTEGER NOT NULL,
    pose_score INTEGER NOT NULL,
    pronunciation_score INTEGER NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    speaking_speed_analysis_speed_by_time_slot TEXT,
    speaking_speed_analysis_average_speed TEXT,
    speaking_speed_analysis_speed_variation TEXT,
    improvements_and_feedback_areas_for_improvement_speaking_speed TEXT,
    improvements_and_feedback_areas_for_improvement_presentation_content TEXT,
    improvements_and_feedback_strengths_speaking_speed TEXT,
    improvements_and_feedback_strengths_presentation_content TEXT,
    additional_practice_recommendations_for_improvement_pronunciation_practice_materials TEXT,
    additional_practice_recommendations_for_improvement_speed_control_practice TEXT,
    recommended_next_steps_set_next_goals TEXT,
    content_feedback_feedback_and_improvements_on_content TEXT,
    pose_list TEXT
  );
`);

export default db;