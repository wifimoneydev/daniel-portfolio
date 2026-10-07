/**
 * Selected GitHub repositories that are not (yet) full case studies.
 * Flagship projects live in content/projects/ instead.
 * Descriptions are taken from each repository's own README.
 */

export type Repo = {
  name: string;
  url: string;
  description: string;
  language?: string;
  tags?: string[];
};

export const repos: Repo[] = [
  {
    name: "t2cclassifier",
    url: "https://github.com/wifimoneydev/t2cclassifier",
    description:
      "Flask web app that classifies photos of waste into six material categories with a CNN trained on the TrashNet dataset.",
    language: "Python",
    tags: ["Computer Vision", "TensorFlow / Keras", "Flask"],
  },
  {
    name: "cli-chatbot",
    url: "https://github.com/wifimoneydev/cli-chatbot",
    description:
      "Command-line RAG assistant: chunks local documents, embeds them with the Gemini API and answers questions from the most similar chunks.",
    language: "Python",
    tags: ["RAG", "Embeddings", "LLMs"],
  },
  {
    name: "Shift-Organizer",
    url: "https://github.com/wifimoneydev/Shift-Organizer",
    description:
      "Shift-scheduling app for Trash2Cash with admin and staff portals. MVP with a Flask + SQLAlchemy backend.",
    language: "TypeScript",
    tags: ["Full Stack", "Flask", "Scheduling"],
  },
];
