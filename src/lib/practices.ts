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
  user_id: number;
  type: string;
  duration: number;
  video_url: string;
}) {
  const { project_id, user_id, type, duration, video_url } = practiceData;

  if (!project_id || !user_id || !type || duration === undefined || !video_url) {
    throw new Error("Missing fields");
  }

  try {
    const project = db
      .prepare("SELECT id FROM projects WHERE id = ? AND user_id = ?")
      .get(project_id, user_id);

    if (!project) {
      throw new Error("Project not found");
    }

    const result = db.prepare(`
      INSERT INTO practices (project_id, type, duration, video_url)
      VALUES (?, ?, ?, ?)
    `).run(project_id, type, duration, video_url);

    if (result.changes === 0) {
      throw new Error("Failed to create practice");
    }

    return result.lastInsertRowid;

  } catch (error) {
    if (error instanceof Error && error.message === "Project not found") {
      throw error;
    }

    throw new Error("Database error: " + String(error));
  }
}

export async function getPracticesByProjectId(projectId: number, userId: number) {
  if (!projectId) {
    throw new Error("Missing project ID");
  }

  if (!userId) {
    throw new Error("Missing user ID");
  }

  try {
    const practices = db.prepare(`
      SELECT practices.*
      FROM practices
      INNER JOIN projects ON projects.id = practices.project_id
      WHERE practices.project_id = ? AND projects.user_id = ?
      ORDER BY practices.created_at DESC
    `).all(String(projectId), userId) as Practice[];
    return practices;

  } catch (error) {
    throw new Error("Database error: " + String(error));
  }
}

export async function getPracticeById(id: number, userId: number) {
  if (!id) {
    throw new Error("Missing practice ID");
  }

  if (!userId) {
    throw new Error("Missing user ID");
  }

  try {
    const practice = db.prepare(`
      SELECT practices.*
      FROM practices
      INNER JOIN projects ON projects.id = practices.project_id
      WHERE practices.id = ? AND projects.user_id = ?
    `).get(String(id), userId) as Practice;
    if (!practice) {
      throw new Error("Practice not found");
    }
    return practice;

  } catch (error) {
    if (error instanceof Error && error.message === "Practice not found") {
      throw error;
    }

    throw new Error("Database error: " + String(error));
  }
}

export async function updatePracticeVideoUrlById(id: number, userId: number, videoUrl: string) {
  if (!id || !userId || !videoUrl) {
    throw new Error("Missing practice ID or video URL");
  }

  try {
    const result = db.prepare(`
      UPDATE practices
      SET video_url = ?
      WHERE id = ?
        AND EXISTS (
          SELECT 1
          FROM projects
          WHERE projects.id = practices.project_id
            AND projects.user_id = ?
        )
    `).run(videoUrl, id, userId);

    if (result.changes === 0) {
      throw new Error("Failed to update practice video URL");
    }

    return true;

  } catch (error) {
    throw new Error("Database error: " + String(error));
  }
}
