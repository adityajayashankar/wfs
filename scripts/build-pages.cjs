const fs = require("fs");
const path = require("path");

const rootDir = path.resolve(__dirname, "..");
const templatePath = path.join(rootDir, "templates", "index.html");
const distDir = path.join(rootDir, "dist");
const distStaticDir = path.join(distDir, "static");
const distIndexPath = path.join(distDir, "index.html");
const noJekyllPath = path.join(distDir, ".nojekyll");

fs.mkdirSync(distStaticDir, { recursive: true });

const html = fs.readFileSync(templatePath, "utf8");
const normalizedHtml = html.replace(
  /<script\s+src=["']\/?static\/bundle\.js["']><\/script>/i,
  '<script src="static/bundle.js"></script>'
);

fs.writeFileSync(distIndexPath, normalizedHtml, "utf8");
fs.writeFileSync(noJekyllPath, "", "utf8");

console.log("Prepared GitHub Pages assets in dist/");
