import { parse } from '@layerstack/utils';

export type ProjectStatsOptions = {
	fetch?: typeof globalThis.fetch;
	githubToken?: string;
	githubRepo: string;
	npmPackage: string;
	discordInvite?: string;
	bskyActor?: string;
	userAgent?: string;
};

export type ProjectStats = {
	githubStars: number | null;
	npmDownloads: [number | null, number | null, number | null];
	bskyFollowers: number | null;
	discordMembers: number | null;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function fetchJson(
	origin: string,
	resource: string,
	options: { fetch: typeof globalThis.fetch; headers?: Record<string, string> }
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<any> {
	const url = `${origin}/${resource}`;
	const response = await options.fetch(url, {
		headers: {
			'Content-Type': 'application/json',
			...options.headers
		}
	});
	const text = await response.text();
	if (!response.ok) {
		console.error(`API GET ${url} failed: ${response.status} ${response.statusText} - ${text}`);
		return null;
	}
	try {
		return parse(text);
	} catch {
		console.error(`API GET ${url} returned invalid JSON: ${text.slice(0, 200)}`);
		return null;
	}
}

function createGitHubHeaders(options: {
	githubToken?: string;
	userAgent?: string;
}): Record<string, string> {
	const headers: Record<string, string> = {
		Accept: 'application/vnd.github.v3+json',
		'User-Agent': options.userAgent ?? '@layerstack/docs'
	};
	if (options.githubToken) {
		const prefix = options.githubToken.startsWith('ghp_') ? 'token' : 'Bearer';
		headers['Authorization'] = `${prefix} ${options.githubToken}`;
	}
	return headers;
}

export async function getProjectStats(options: ProjectStatsOptions): Promise<ProjectStats> {
	const fetch = options.fetch ?? globalThis.fetch;
	const githubHeaders = createGitHubHeaders(options);
	const [githubData, npmWeeklyData, npmMonthlyData, npmLifetimeData, discordData, bskyData] =
		await Promise.all([
			fetchJson('https://api.github.com', `repos/${options.githubRepo}`, {
				fetch,
				headers: githubHeaders
			}),
			fetchJson('https://api.npmjs.org', `downloads/point/last-week/${options.npmPackage}`, {
				fetch
			}),
			fetchJson('https://api.npmjs.org', `downloads/point/last-month/${options.npmPackage}`, {
				fetch
			}),
			fetchJson(
				'https://api.npmjs.org',
				`downloads/point/2020-01-01:2099-12-31/${options.npmPackage}`,
				{ fetch }
			),
			options.discordInvite
				? fetchJson(
						'https://discord.com',
						`api/v9/invites/${options.discordInvite}?with_counts=true`,
						{ fetch }
					)
				: null,
			options.bskyActor
				? fetchJson(
						'https://public.api.bsky.app',
						`xrpc/app.bsky.actor.getProfile?actor=${options.bskyActor}`,
						{ fetch }
					)
				: null
		]);

	const npmWeekly = npmWeeklyData?.downloads ?? null;
	const npmMonthly = npmMonthlyData?.downloads ?? null;
	const npmLifetime = npmLifetimeData?.downloads ?? null;

	return {
		githubStars: githubData?.stargazers_count ?? null,
		npmDownloads: [npmWeekly, npmMonthly, npmLifetime],
		bskyFollowers: bskyData?.followersCount ?? null,
		discordMembers: discordData?.approximate_member_count ?? null
	};
}
