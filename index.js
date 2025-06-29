// main.js
import fs from 'fs';
import path from 'path';
import axios from 'axios';
import unzipper from 'unzipper';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';
import chalk from 'chalk';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DOWNLOAD_URL = "https://github.com/Professeur-xd/xmd/archive/refs/heads/main.zip";
const TEMP_DIR = path.join(__dirname, ".haiko_temp");
const EXTRACT_DIR = path.join(TEMP_DIR, "xmd-main");

async function downloadAndExtract() {
  if (fs.existsSync(TEMP_DIR)) {
    console.log(chalk.yellow("⬣ Suppression de l'ancien dossier..."));
    fs.rmSync(TEMP_DIR, { recursive: true, force: true });
  }

  fs.mkdirSync(TEMP_DIR, { recursive: true });

  console.log(chalk.blue("⬇️ Téléchargement du bot depuis GitHub..."));
  const response = await axios({
    url: DOWNLOAD_URL,
    method: "GET",
    responseType: "stream"
  });

  await new Promise((resolve, reject) => {
    response.data
      .pipe(unzipper.Extract({ path: TEMP_DIR }))
      .on("close", resolve)
      .on("error", reject);
  });

  console.log(chalk.green("✅ Extraction terminée !"));
}

async function startBot() {
  console.log(chalk.cyan("🚀 Lancement du bot HAIKO-XMD..."));
  const child = spawn("node", [path.join(EXTRACT_DIR, "index.js")], {
    stdio: "inherit",
    env: process.env
  });

  child.on("close", code => {
    console.log(chalk.red(`❌ Le bot s'est arrêté avec le code ${code}`));
  });
}

(async () => {
  await downloadAndExtract();
  await startBot();
})();
