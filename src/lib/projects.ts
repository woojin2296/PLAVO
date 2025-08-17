import db from "@/lib/database";

export type Project = {
  id: number;
  user_id: number;
  name: string;
  description: string;
  due_date: string;
  goal_time: number;
  created_at: string;
};

// Input : { user_id, name, description, due_date, goal_time }
// Output: project_id
export async function createProject(projectData: {
  user_id: number;
  name: string;
  description: string;
  due_date: string;
  goal_time: number;
}) {
  const { user_id, name, description, due_date, goal_time } = projectData;

  if (!user_id || !name || !description || !due_date || goal_time === undefined) {
    throw new Error("Missing fields");
  }

  try {
    const result = db.prepare(`
      INSERT INTO projects (user_id, name, description, due_date, goal_time)
      VALUES (?, ?, ?, ?, ?)
    `).run(user_id, name, description, due_date, goal_time);

    if (result.changes === 0) {
      throw new Error("Failed to create project");
    }

    return result.lastInsertRowid;

  } catch (error) {
    throw new Error("Database error: " + String(error));
  }
}

// Input: project_id
// Output: Project object
export async function getProjectById(id: number) {
  if (!id) {
    throw new Error("Missing project ID");
  }
  try {
    const project = db.prepare("SELECT * FROM projects WHERE id = ?").get(id) as Project;
    if (!project) {
      throw new Error("Project not found");
    }
    return project;
  } catch (error) {
    throw new Error("Database error: " + String(error));
  }
}

// Input: user_id
// Output: Array of Project objects
export async function getProjectsByUserId(id: number) {
  if (!id) {
    throw new Error("Missing user ID");
  }
  try {
    const projects = db.prepare("SELECT * FROM projects WHERE user_id = ?").all(id) as Project[];
    return projects;
  } catch (error) {
    throw new Error("Database error: " + String(error));
  }
}

// Input: user_id
// Output: Array of ongoing Project objects (due_date >= today)
export async function getOngoingProjectsByUserId(id: number) {
  if (!id) {
    throw new Error("Missing user ID");
  }
  try {
    const projects = db.prepare(`
      SELECT * FROM projects 
      WHERE user_id = ? AND due_date >= DATE('now')
    `).all(id) as Project[];
    
    return projects;
  } catch (error) {
    throw new Error("Database error: " + String(error));
  }
}