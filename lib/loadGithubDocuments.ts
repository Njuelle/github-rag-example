import { Document } from "langchain/document";
import { GithubRepoLoader } from "langchain/document_loaders/web/github";

export async function loadGithubDocuments({
  repositoryUrl,
}: {
  repositoryUrl: string;
}): Promise<Document[]> {
  const loader = new GithubRepoLoader(repositoryUrl, {
    branch: "main",
    recursive: true,
    ignoreFiles: ["bun.lockb"],
  });

  return loader.load();
}
