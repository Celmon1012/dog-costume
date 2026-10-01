import { cookies } from "next/headers";

export const VOTER_COOKIE = "contest_voter_id";

export async function getVoterId(): Promise<string | null> {
  const store = await cookies();
  return store.get(VOTER_COOKIE)?.value ?? null;
}
