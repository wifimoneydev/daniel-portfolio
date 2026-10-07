/**
 * Architecture × Technology — current interests.
 * These are interests and directions, not completed work.
 * Published experiments come from content/ projects with the category
 * "Architecture + Technology" or "Experimental".
 */

export type LabStatus = "Exploring" | "Building toward" | "Experimenting";

export type LabInterest = {
  title: string;
  status: LabStatus;
  description: string;
};

export const lab = {
  intro:
    "Architecture taught me to think in space, structure and experience. Software lets those ideas become interactive. The Lab is where the two disciplines start to meet — a working space for experiments, not a showcase of finished work.",
  interests: [
    {
      title: "Three.js",
      status: "Exploring",
      description: "Rendering architectural form in the browser with WebGL.",
    },
    {
      title: "Interactive 3D",
      status: "Exploring",
      description: "Spaces that can be navigated and inspected, not only viewed as still images.",
    },
    {
      title: "Real-time architectural visualisation",
      status: "Building toward",
      description: "Presenting design work as live, explorable models alongside drawings and renders.",
    },
    {
      title: "AI-assisted architectural experiences",
      status: "Exploring",
      description: "Where language and vision models could help people understand and interact with buildings.",
    },
  ] satisfies LabInterest[],
};
