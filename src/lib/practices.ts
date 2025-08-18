import db from "@/lib/database";

export type Practice = {
  id: number;
  project_id: number;
  type: string;
  duration: number;
  video_url: string;
  created_at: string;
};

export async function createPractice(practiceData: {
  project_id: number;
  type: string;
  duration: number;
  video_url: string;
}) {
  const { project_id, type, duration, video_url } = practiceData;

  if (!project_id || !type || duration === undefined || !video_url) {
    throw new Error("Missing fields");
  }

  try {
    const result = db.prepare(`
      INSERT INTO practices (project_id, type, duration, video_url)
      VALUES (?, ?, ?, ?)
    `).run(project_id, type, duration, video_url);

    if (result.changes === 0) {
      throw new Error("Failed to create practice");
    }

    return result.lastInsertRowid;

  } catch (error) {
    throw new Error("Database error: " + String(error));
  }
}

export async function getPracticesByProjectId(projectId: number) {
  if (!projectId) {
    throw new Error("Missing project ID");
  }

  try {
    const practices = db.prepare("SELECT * FROM practices WHERE project_id = ? ORDER BY created_at DESC").all(String(projectId)) as Practice[];
    return practices;

  } catch (error) {
    throw new Error("Database error: " + String(error));
  }
}

export async function getPracticeById(id: number) {
  if (!id) {
    throw new Error("Missing practice ID");
  }

  try {
    const practice = db.prepare("SELECT * FROM practices WHERE id = ?").get(String(id)) as Practice;
    if (!practice) {
      throw new Error("Practice not found");
    }
    return practice;

  } catch (error) {
    throw new Error("Database error: " + String(error));
  }
}

export async function updatePracticeVideoUrlById(id: number, videoUrl: string) {
  if (!id || !videoUrl) {
    throw new Error("Missing practice ID or video URL");
  }

  try {
    const result = db.prepare(`
      UPDATE practices
      SET video_url = ?
      WHERE id = ?
    `).run(videoUrl, id);

    if (result.changes === 0) {
      throw new Error("Failed to update practice video URL");
    }

    return true;

  } catch (error) {
    throw new Error("Database error: " + String(error));
  }
}