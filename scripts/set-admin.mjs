// Sets the admin login in .env.local: asks for an email and a password (hidden),
// then stores ADMIN_EMAIL and a bcrypt ADMIN_PASSWORD_HASH escaped the way Next.js .env files need.
//
//   npm run admin:set
//
import fs from "node:fs";
import path from "node:path";
import readline from "node:readline";
import { Writable } from "node:stream";
import bcrypt from "bcryptjs";

const envPath = path.resolve(process.cwd(), ".env.local");

let muted = false;
const output = new Writable({
  write(chunk, encoding, callback) {
    if (!muted) process.stdout.write(chunk, encoding);
    callback();
  }
});
const rl = readline.createInterface({ input: process.stdin, output, terminal: true });

// Lines are queued so input that arrives before the next prompt (pasted or piped) is never lost.
const queued = [];
const waiting = [];
rl.on("line", (line) => (waiting.length ? waiting.shift()(line) : queued.push(line)));

function ask(question, hidden = false) {
  process.stdout.write(question);
  muted = hidden;
  return new Promise((resolve) => {
    const finish = (line) => {
      muted = false;
      if (hidden) process.stdout.write("\n");
      resolve(line.trim());
    };
    if (queued.length) finish(queued.shift());
    else waiting.push(finish);
  });
}

function setKey(contents, key, value) {
  const line = `${key}=${value}`;
  const pattern = new RegExp(`^${key}=.*$`, "m");
  if (pattern.test(contents)) return contents.replace(pattern, () => line);
  return `${contents.replace(/\s*$/, "\n")}${line}\n`;
}

const email = await ask("Admin email: ");
if (!/^\S+@\S+\.\S+$/.test(email)) {
  console.error("That doesn't look like an email address. Nothing was saved.");
  process.exit(1);
}

const password = await ask("Admin password (min 8 characters, hidden): ", true);
if (password.length < 8) {
  console.error("The password must be at least 8 characters. Nothing was saved.");
  process.exit(1);
}
const again = await ask("Repeat the password: ", true);
if (again !== password) {
  console.error("The passwords don't match. Nothing was saved.");
  process.exit(1);
}
rl.close();

const hash = bcrypt.hashSync(password, 10);
const contents = fs.existsSync(envPath) ? fs.readFileSync(envPath, "utf8") : "";
// Next.js expands $VARS inside .env files, so every $ in the hash must be escaped locally.
const updated = setKey(setKey(contents, "ADMIN_EMAIL", email), "ADMIN_PASSWORD_HASH", hash.replace(/\$/g, "\\$"));
fs.writeFileSync(envPath, updated);

console.log(`\nSaved ADMIN_EMAIL and ADMIN_PASSWORD_HASH to ${path.basename(envPath)}.`);
console.log("\nFor Vercel (Settings -> Environment Variables), use these exact values.");
console.log("The hash there must be the plain one, without backslashes:\n");
console.log(`ADMIN_EMAIL=${email}`);
console.log(`ADMIN_PASSWORD_HASH=${hash}\n`);
