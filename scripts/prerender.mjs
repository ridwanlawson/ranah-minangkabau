import { createServer } from "vite";
import React from "react";
import { renderToString } from "react-dom/server";
import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const outputPath = resolve(root, "dist/index.html");
const server = await createServer({
  configFile: resolve(root, "vite.config.js"),
  root,
  appType: "custom",
  server: { middlewareMode: true },
});

try {
  const { Scene } = await server.ssrLoadModule("/src/Scene.jsx");
  const markup = renderToString(React.createElement(Scene));
  const document = await readFile(outputPath, "utf8");
  const rootPlaceholder = '<div id="root"></div>';

  if (!document.includes(rootPlaceholder)) {
    throw new Error("The production HTML does not contain the expected React root.");
  }

  await writeFile(outputPath, document.replace(rootPlaceholder, `<div id="root">${markup}</div>`));
} finally {
  await server.close();
}
