import { cookies } from "next/headers";

export const VOTER_COOKIE = "contest_voter_id";

export async function getVoterId(): Promise<string | null> {
  const store = await cookies();
  const existing = store.get(VOTER_COOKIE)?.value;
  if (existing) return existing;

  const voterId = crypto.randomUUID();
  try {
    store.set(VOTER_COOKIE, voterId, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
    });
  } catch {
    return null;
  }
  return voterId;
}
