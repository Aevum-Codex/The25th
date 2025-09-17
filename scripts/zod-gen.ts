// scripts/zod-gen.ts
import { execSync } from "child_process";
import { readdirSync } from "fs";
import { join, basename } from "path";

function main() {
  const inputDir = "beanie_schemas";
  const outputDir = "lib/schemas";

  const files = readdirSync(inputDir).filter(f => f.endsWith(".json"));

  for (const file of files) {
    const base = basename(file, ".json");
    const inputPath = join(inputDir, file);
    const outputPath = join(outputDir, `${base}.schema.ts`);

    console.log(`⏳ Generating Zod schema for ${file} -> ${outputPath}`);
    execSync(`json-schema-to-zod -i "${inputPath}" -o "${outputPath}"`, {
      stdio: "inherit"
    });
  }

  console.log("✅ Zod schemas generated successfully!");
}

main();
