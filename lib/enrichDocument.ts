import { Document } from "langchain/document";
import { OpenAI } from "langchain/llms/openai";
import { PromptTemplate } from "langchain/prompts";

const summarizeCodePromptTemplate = new PromptTemplate({
  template: `You are an excelent developer.
I will give you a source code file, and you will create a summary with these information:
- type of the file
- purpose of the file
- used language and framework
- imported packages / files
- name of all the functions, methods, classes and types that are declared in the file that are not imported
- path of the file

You have to be concise because this summary will be vectorized and persisted in a database to do semantic search.
You should not add more text, only the summary.

Here is the souce code file:
# BEGIN SOURCE CODE FILE
{sourceCodeFile}
# END SOURCE CODE FILE

Here is the path of the file: "{path}"
`,
  inputVariables: ["sourceCodeFile", "path"],
});

export async function enrichDocument({
  model,
  document,
}: {
  model: OpenAI;
  document: Document;
}): Promise<Document> {
  const prompt = await summarizeCodePromptTemplate.format({
    sourceCodeFile: document.pageContent,
    path: document.metadata.source,
  });

  const summary = await model.call(prompt);

  return {
    ...document,
    pageContent: `${summary}\n- source code: \n \`\`\`\n${document.pageContent}\n\`\`\``,
  };
}
