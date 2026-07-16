const fs = require("fs");
const path = require("path");
const childProcess = require("child_process");

const root = path.resolve(__dirname, "..");
const appFile = path.join(root, "app.js");
const htmlFile = path.join(root, "index.html");
const packageFile = path.join(root, "package.json");

function fail(message) {
  console.error(`FAIL ${message}`);
  process.exitCode = 1;
}

function pass(message) {
  console.log(`OK ${message}`);
}

function read(file) {
  return fs.readFileSync(file, "utf8");
}

try {
  JSON.parse(read(packageFile));
  pass("package.json is valid JSON");
} catch (error) {
  fail(`package.json is invalid: ${error.message}`);
}

try {
  childProcess.execFileSync(process.execPath, ["--check", appFile], { stdio: "pipe" });
  pass("app.js syntax is valid");
} catch (error) {
  fail(`app.js syntax check failed:\n${String(error.stderr || error.message)}`);
}

const html = read(htmlFile);
const app = read(appFile);
const ids = [...html.matchAll(/id="([^"]+)"/g)].map((match) => match[1]);
const duplicateIds = [...new Set(ids.filter((id, index) => ids.indexOf(id) !== index))];
if (duplicateIds.length) fail(`duplicate HTML ids: ${duplicateIds.join(", ")}`);
else pass("HTML ids are unique");

const functionNames = [...app.matchAll(/^function\s+([A-Za-z0-9_]+)\s*\(/gm)].map((match) => match[1]);
const duplicateFunctions = [...new Set(functionNames.filter((name, index) => functionNames.indexOf(name) !== index))];
if (duplicateFunctions.length) fail(`duplicate function declarations: ${duplicateFunctions.join(", ")}`);
else pass("function declarations are unique");

const requiredIds = [
  "networkView",
  "manageView",
  "personView",
  "dialogueView",
  "scheduleView",
  "settingsView",
  "chatThread",
  "dialogueInput",
  "customReply",
  "analysisBox",
  "memoryNote",
  "aiEnabledToggle",
  "testAiConfigButton",
  "importMemoryInput"
];
const missingIds = requiredIds.filter((id) => !ids.includes(id));
if (missingIds.length) fail(`missing required HTML ids: ${missingIds.join(", ")}`);
else pass("required HTML controls exist");

const sensitivePatterns = [
  /sk-[A-Za-z0-9_-]{10,}/,
  /Bearer\s+[A-Za-z0-9._-]{10,}/
];
const sensitiveHits = sensitivePatterns.filter((pattern) => pattern.test(app) || pattern.test(html));
if (sensitiveHits.length) fail("possible API key or bearer token found in source");
else pass("no obvious API key tokens in source");

if (process.exitCode) process.exit(process.exitCode);
