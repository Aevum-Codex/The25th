// scripts/zod-gen.ts
import { readdirSync, readFileSync } from "fs";
import { join, basename } from "path";
import { convertJSONSchemaToZod } from "./json-to-zod-converter";
import { writeFileSync } from "fs";

function main() {
  const inputDir = "beanie_schemas";
  const outputDir = "lib/schemas";

  const files = readdirSync(inputDir).filter(f => f.endsWith(".json"));

  for (const file of files) {
    const base = basename(file, ".json");
    const inputPath = join(inputDir, file);
    const outputPath = join(outputDir, `${base}.schema.ts`);

    console.log(`⏳ Generating Zod schema for ${file} -> ${outputPath}`);
    
    try {
      // Read and parse JSON schema
      const jsonContent = readFileSync(inputPath, 'utf-8');
      const jsonSchema = JSON.parse(jsonContent);
      
      // Convert to Zod using our custom converter
      const zodCode = convertJSONSchemaToZod(jsonSchema);
      
      // Write the output
      writeFileSync(outputPath, zodCode);
      
      console.log(`✅ Generated ${outputPath}`);
    } catch (error) {
      console.error(`❌ Error processing ${file}:`, error);
    }
  }

  console.log("✅ Zod schemas generated successfully!");
}

main();
