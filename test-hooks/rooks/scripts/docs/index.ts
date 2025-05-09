import { writeFileSync, readFileSync } from "fs";
import parseReadme from "./parse-readme";

const packageName = process.env.LERNA_PACKAGE_NAME;
const newReadmeFileName = packageName?.startsWith("@rooks")
  ? packageName?.split("@rooks/")[1]
  : packageName;

function ls() {
  let readmeFileContent = readFileSync(`./README.md`, "utf8");
  readmeFileContent = readmeFileContent.replace(
    /!\[TitleCard\]\([:\.\w/-]+.svg\)/,
    ""
  );
  readmeFileContent = parseReadme(readmeFileContent);
  let examplesFileContent = "";
  try {
    examplesFileContent = readFileSync(`./Examples.md`, "utf8");
  } catch (err) {
    console.log("Could not read examples in package: " + newReadmeFileName);
  }
  let frontMatter = `id: ${newReadmeFileName}
title: ${newReadmeFileName}
sidebar_label: ${newReadmeFileName}`;
  if (newReadmeFileName === "rooks") {
    frontMatter = `${frontMatter}      
slug: /`;
  }
  const fileBody = examplesFileContent
    ? `
${readmeFileContent}

---

## Codesandbox Examples

${examplesFileContent}    

`
    : readmeFileContent;

  const updatedFileContent = `---
${frontMatter}
---

${fileBody}

## Join Bhargav's discord server
You can click on the floating discord icon at the bottom right of the screen and talk to us in our server.

    `;
  writeFileSync(
    `../docusaurus/docs/${newReadmeFileName}.md`,
    updatedFileContent,
    "utf8"
  );
}

function addToSidebarJson() {
  let CUSTOM_HOOKS_SIDEBAR_INDEX = 1;
  if (newReadmeFileName === "rooks") {
    return;
  }
  let currentSidebarJson;
  let fileContent: string;
  try {
    fileContent = readFileSync(`../docusaurus/sidebars.json`, "utf8");
    currentSidebarJson = JSON.parse(fileContent);
    if (
      Object.keys(
        currentSidebarJson.docs[CUSTOM_HOOKS_SIDEBAR_INDEX].items
      ).includes("newReadmeFileName")
    ) {
      return;
    }
    const customHooks = {
      ...currentSidebarJson.docs[CUSTOM_HOOKS_SIDEBAR_INDEX],
      items: Array.from(
        new Set(
          [
            ...currentSidebarJson.docs[CUSTOM_HOOKS_SIDEBAR_INDEX].items,
            newReadmeFileName,
          ].sort()
        )
      ),
    };
    const newSidebarJson = {
      ...currentSidebarJson,
      docs: [
        ...currentSidebarJson.docs.slice(0, CUSTOM_HOOKS_SIDEBAR_INDEX),
        customHooks,
        ...currentSidebarJson.docs.slice(CUSTOM_HOOKS_SIDEBAR_INDEX + 1),
      ],
    };
    writeFileSync(
      `../docusaurus/sidebars.json`,
      JSON.stringify(newSidebarJson, null, 2),
      "utf-8"
    );
  } catch (err) {
    console.log("----");
    console.log(err);
    console.log("----");
  }
}

try {
  ls();
  addToSidebarJson();
} catch (err) {
  console.log(err);
}
