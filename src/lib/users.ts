import db from "@/lib/database";
import { hashPassword, verifyPassword } from "@/lib/password";

export type User = {
  id: number;
  email: string;
  name: string;
};

type UserWithPassword = User & {
  passwordHash: string;
};

// Input: { email, password }
// Output: User object
export async function verifyUser(email: string, password: string) {
  if (!email || !password) {
    throw new Error("Missing email or password");
  }

  let user: UserWithPassword | undefined;

  try {
    user = db
      .prepare("SELECT id, email, name, password AS passwordHash FROM users WHERE email = ?")
      .get(email) as UserWithPassword | undefined;
  } catch (error) {
    throw new Error("Database error: " + String(error));
  }

  if (!user || !verifyPassword(password, user.passwordHash)) {
    throw new Error("Invalid credentials");
  }

  return {
    id: user.id,
    email: user.email,
    name: user.name,
  };
}

// Input: { email, password, name }
// Output: user_id
export async function createUser(userData: {
  email: string;
  password: string;
  name: string;
}) {
  const { email, password, name } = userData;

  if (!email || !password || !name) {
    throw new Error("Missing fields");
  }

  try {
    const existingUser = db.prepare("SELECT * FROM users WHERE email = ?").get(email) as User;

    if (existingUser) {
      throw new Error("User already exists");
    }

    const passwordHash = hashPassword(password);

    const result = db.prepare(`
      INSERT INTO users (email, password, name)
      VALUES (?, ?, ?)
    `).run(email, passwordHash, name);

    if (result.changes === 0) {
      throw new Error("Failed to create user");
    }

    return result.lastInsertRowid;
    
  } catch (error) {
    throw new Error("Database error: " + String(error));
  }
}

// Input: user_id
// Output: User object
export async function getUserById(id: number) {
  if (!id) {
    throw new Error("Missing user ID");
  }

  try {
    const user = db.prepare("SELECT * FROM users WHERE id = ?").get(id) as User;
    
    if (!user) {
      throw new Error("User not found");
    }

    return user;
  } catch (error) {
    throw new Error("Database error: " + String(error));
  }
}
