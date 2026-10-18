import { GITHUB_USER, HIDDEN, PINNED } from '../config';

const API = 'https://api.github.com';

export type Project = {
  name: string;
  description: string | null;
  homepage: string | null;
  updatedAt: string;
  featured: boolean;
};

type GhRepo = {
  name: string;
  description: string | null;
  homepage: string | null;
  pushed_at: string;
  fork: boolean;
  archived: boolean;
};

async function gh<T>(path: string): Promise<T> {
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  };
  const token = import.meta.env.GITHUB_TOKEN || process.env.GITHUB_TOKEN;
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API}${path}`, { headers, signal: AbortSignal.timeout(10000) });
  if (!res.ok) {
    const detail = (await res.text()).slice(0, 500).replace(/[^\x20-\x7E]/g, '?');
    const remaining = res.headers.get('x-ratelimit-remaining') ?? 'unknown';
    const reset = res.headers.get('x-ratelimit-reset') ?? 'unknown';
    throw new Error(
      `GitHub API ${path} returned ${res.status}; token=${token ? 'configured' : 'missing'}; ` +
      `rate-limit-remaining=${remaining}; rate-limit-reset=${reset}; response=${detail}`
    );
  }
  return res.json();
}

export async function getProjects(): Promise<Project[]> {
  const repos: GhRepo[] = [];
  for (let page = 1; ; page++) {
    const batch = await gh<GhRepo[]>(`/users/${GITHUB_USER}/repos?per_page=100&sort=pushed&page=${page}`);
    repos.push(...batch);
    if (batch.length < 100) break;
  }

  const projects = repos
      .filter((r) => !r.fork && !r.archived && !HIDDEN.includes(r.name))
      .map((r): Project => ({
        name: r.name,
        description: r.description,
        homepage: safeHomepage(r.homepage),
        updatedAt: r.pushed_at,
        featured: PINNED.includes(r.name),
      }));

  return projects.sort((a, b) => {
    const ai = PINNED.indexOf(a.name);
    const bi = PINNED.indexOf(b.name);
    if (ai !== bi) return (ai === -1 ? Infinity : ai) - (bi === -1 ? Infinity : bi);
    return Date.parse(b.updatedAt) - Date.parse(a.updatedAt);
  });
}

function safeHomepage(value: string | null): string | null {
  if (!value) return null;
  try {
    const url = new URL(value);
    return url.protocol === 'https:' ? url.toString() : null;
  } catch {
    return null;
  }
}
