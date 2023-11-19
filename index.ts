import { OpenAI } from "langchain/llms/openai";
import { loadGithubDocuments } from "./lib/loadGithubDocuments";
import { enrichDocument } from "./lib/enrichDocument";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { RetrievalQAChain } from "langchain/chains";

const repositoryUrl = "https://github.com/Njuelle/github-rag-example";

const documents = await loadGithubDocuments({ repositoryUrl });

const model = new OpenAI({
  modelName: "gpt-4-1106-preview",
  maxTokens: -1,
});

const enrichedDocuments = await Promise.all(
  documents.map(async (document) => {
    return enrichDocument({ model, document });
  })
);

const vectorStore = await MemoryVectorStore.fromDocuments(
  enrichedDocuments,
  new OpenAIEmbeddings()
);

const query =
  "Peux tu me donner une explication de la fonction 'enrichDocument' ?";

const { text } = await RetrievalQAChain.fromLLM(
  model,
  vectorStore.asRetriever()
).call({
  query,
});

console.log(text);
