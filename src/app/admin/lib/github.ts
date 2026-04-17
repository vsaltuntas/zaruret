const OWNER = "vsaltuntas";
const REPO = "zaruret";
// Site hangi branch'ten build oluyorsa admin de oraya commit atar.
// CF Pages / GH Pages o branch'i izliyor olmali.
const BRANCH = "claude/music-label-websites-tHRWw";
const API = "https://api.github.com";

export type GitHubAuth = {
  token: string;
  user?: string;
};

function headers(token: string) {
  return {
    Authorization: `Bearer ${token}`,
    "X-GitHub-Api-Version": "2022-11-28",
    Accept: "application/vnd.github+json",
  };
}

export async function ghWhoAmI(token: string) {
  const res = await fetch(`${API}/user`, { headers: headers(token) });
  if (!res.ok) throw new Error(`GitHub auth failed (${res.status})`);
  return res.json() as Promise<{ login: string; name: string; avatar_url: string }>;
}

export async function ghGetFile(
  token: string,
  path: string,
  branch = BRANCH
): Promise<{ content: string; sha: string } | null> {
  const res = await fetch(
    `${API}/repos/${OWNER}/${REPO}/contents/${encodeURI(path)}?ref=${branch}`,
    { headers: headers(token) }
  );
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`ghGetFile failed (${res.status}): ${await res.text()}`);
  const data = (await res.json()) as { content: string; sha: string; encoding: string };
  const decoded = atob(data.content.replace(/\n/g, ""));
  return { content: decoded, sha: data.sha };
}

export async function ghListDir(
  token: string,
  path: string,
  branch = BRANCH
): Promise<{ name: string; path: string; type: string }[]> {
  const res = await fetch(
    `${API}/repos/${OWNER}/${REPO}/contents/${encodeURI(path)}?ref=${branch}`,
    { headers: headers(token) }
  );
  if (res.status === 404) return [];
  if (!res.ok) throw new Error(`ghListDir failed (${res.status})`);
  return res.json();
}

export async function ghWriteFile(
  token: string,
  path: string,
  content: string | Uint8Array,
  message: string,
  branch = BRANCH,
  prevSha?: string
) {
  const base64 =
    typeof content === "string"
      ? btoa(unescape(encodeURIComponent(content)))
      : bytesToBase64(content);
  const body: Record<string, unknown> = {
    message,
    content: base64,
    branch,
  };
  if (prevSha) body.sha = prevSha;
  const res = await fetch(
    `${API}/repos/${OWNER}/${REPO}/contents/${encodeURI(path)}`,
    {
      method: "PUT",
      headers: { ...headers(token), "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }
  );
  if (!res.ok) throw new Error(`ghWriteFile failed (${res.status}): ${await res.text()}`);
  return res.json();
}

export async function ghDeleteFile(
  token: string,
  path: string,
  message: string,
  sha: string,
  branch = BRANCH
) {
  const res = await fetch(
    `${API}/repos/${OWNER}/${REPO}/contents/${encodeURI(path)}`,
    {
      method: "DELETE",
      headers: { ...headers(token), "Content-Type": "application/json" },
      body: JSON.stringify({ message, sha, branch }),
    }
  );
  if (!res.ok) throw new Error(`ghDeleteFile failed (${res.status}): ${await res.text()}`);
  return res.json();
}

function bytesToBase64(bytes: Uint8Array): string {
  let binary = "";
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
  }
  return btoa(binary);
}

export async function ghLatestCommit(token: string, branch = BRANCH) {
  const res = await fetch(
    `${API}/repos/${OWNER}/${REPO}/commits/${branch}`,
    { headers: headers(token) }
  );
  if (!res.ok) return null;
  return res.json() as Promise<{
    sha: string;
    commit: { message: string; author: { date: string } };
  }>;
}

export async function ghWorkflowRuns(token: string, branch = BRANCH) {
  const res = await fetch(
    `${API}/repos/${OWNER}/${REPO}/actions/runs?branch=${branch}&per_page=5`,
    { headers: headers(token) }
  );
  if (!res.ok) return { workflow_runs: [] as Array<Record<string, unknown>> };
  return res.json();
}
