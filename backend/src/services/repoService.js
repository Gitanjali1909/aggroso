const MAX_FILES = 25;
const MAX_FILE_CHARS = 4000;
const MAX_TOTAL_CHARS = 60000;

function parseGitHubUrl(url) {
  const match = url.match(/^https?:\/\/github\.com\/([^\/]+)\/([^\/\?#]+)(?:\/tree\/([^\/\?#]+))?/i);
  if (!match) {
    throw new Error("Invalid GitHub repository URL. Use format: https://github.com/owner/repo");
  }

  return {
    owner: match[1],
    repo: match[2].replace(/\.git$/, ""),
    branch: match[3] || "",
  };
}

async function fetchJson(url) {
  const response = await fetch(url, {
    headers: {
      "User-Agent": "codebase-qa-app",
      Accept: "application/vnd.github+json",
    },
  });

  if (!response.ok) {
    throw new Error(`GitHub request failed: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

async function getDefaultBranch(owner, repo) {
  const repoMeta = await fetchJson(`https://api.github.com/repos/${owner}/${repo}`);
  return repoMeta.default_branch || "main";
}

async function walkContents(owner, repo, path, branch, collector) {
  if (collector.files.length >= MAX_FILES || collector.totalChars >= MAX_TOTAL_CHARS) {
    return;
  }

  const encodedPath = path ? `/${encodeURIComponent(path).replace(/%2F/g, "/")}` : "";
  const items = await fetchJson(
    `https://api.github.com/repos/${owner}/${repo}/contents${encodedPath}?ref=${encodeURIComponent(branch)}`
  );

  if (!Array.isArray(items)) {
    return;
  }

  for (const item of items) {
    if (collector.files.length >= MAX_FILES || collector.totalChars >= MAX_TOTAL_CHARS) {
      break;
    }

    if (item.type === "dir") {
      await walkContents(owner, repo, item.path, branch, collector);
      continue;
    }

    if (item.type === "file") {
      try {
        const textRes = await fetch(item.download_url, {
          headers: { "User-Agent": "codebase-qa-app" },
        });
        if (!textRes.ok) {
          continue;
        }

        const text = (await textRes.text()).slice(0, MAX_FILE_CHARS);
        collector.files.push({ path: item.path, content: text });
        collector.totalChars += text.length;
      } catch {
        continue;
      }
    }
  }
}

export async function extractCodebaseFromRepo(repoUrl) {
  const { owner, repo, branch } = parseGitHubUrl(repoUrl);
  const resolvedBranch = branch || (await getDefaultBranch(owner, repo));

  const collector = { files: [], totalChars: 0 };
  await walkContents(owner, repo, "", resolvedBranch, collector);

  if (!collector.files.length) {
    throw new Error("Could not extract code from the repository.");
  }

  return collector.files
    .map((file) => `FILE: ${file.path}\n${file.content}`)
    .join("\n\n-----\n\n");
}