import bcrypt from "bcryptjs";
import readline from "node:readline";

/**
 * Securely retrieves the password from environment variables or via a hidden prompt.
 * @returns {Promise<string|null>} The password or null if not available.
 */
async function getPassword() {
  // Check for environment variable first (recommended for non-interactive use)
  if (process.env.ADMIN_PASSWORD) {
    return process.env.ADMIN_PASSWORD;
  }

  // Fallback to interactive prompt if running in a TTY
  if (process.stdin.isTTY) {
    return new Promise((resolve) => {
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
      });

      const query = "Enter password: ";

      // Hook into the private _writeToOutput to hide user input
      // This is a common Node.js pattern for simple hidden prompts without external dependencies
      rl._writeToOutput = function _writeToOutput(stringToWrite) {
        if (
          stringToWrite === query ||
          stringToWrite === "\r\n" ||
          stringToWrite === "\n" ||
          stringToWrite === "\r"
        ) {
          rl.output.write(stringToWrite);
        }
      };

      rl.question(query, (password) => {
        rl.close();
        resolve(password);
      });
    });
  }

  return null;
}

async function main() {
  const password = await getPassword();

  if (!password) {
    console.error("Error: Password not provided.");
    console.error("\nTo provide a password securely, you can:");
    console.error("1. Set the ADMIN_PASSWORD environment variable:");
    console.error("   ADMIN_PASSWORD=your_password node generate-hash.mjs");
    console.error("\n2. Run the script in an interactive terminal to be prompted.");
    process.exit(1);
  }

  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);

  // Success: Only output the hash, never the plain-text password
  console.log("Hash:", hash);
}

main().catch((error) => {
  console.error("Error generating hash:", error);
  process.exit(1);
});
