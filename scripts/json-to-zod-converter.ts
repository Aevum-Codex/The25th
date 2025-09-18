// scripts/json-to-zod-converter.ts
import { writeFileSync } from "fs";

interface JSONSchema {
  $defs?: Record<string, JSONSchema>;
  type?: string;
  properties?: Record<string, JSONSchema>;
  required?: string[];
  enum?: unknown[];
  anyOf?: JSONSchema[];
  oneOf?: JSONSchema[];
  allOf?: JSONSchema[];
  items?: JSONSchema;
  additionalProperties?: boolean | JSONSchema;
  format?: string;
  minimum?: number;
  maximum?: number;
  minLength?: number;
  maxLength?: number;
  minItems?: number;
  maxItems?: number;
  pattern?: string;
  default?: unknown;
  title?: string;
  description?: string;
  $ref?: string;
}

class JSONToZodConverter {
  private definitions: Record<string, JSONSchema> = {};
  private generatedTypes = new Set<string>();
  private zodCode: string[] = [];
  private commonSchemas = new Set([
    'PydanticObjectId',
    'MediaType', 
    'MediaRef',
    'UserType',
    'TargetType',
    'PostType',
    'ReactionType'
  ]);
  private usedCommonSchemas = new Set<string>();

  constructor(private schema: JSONSchema) {
    if (schema.$defs) {
      this.definitions = schema.$defs;
    }
  }

  convert(): string {
    this.zodCode = ['import { z } from "zod"'];
    
    // Generate definitions first to identify used common schemas
    if (this.definitions) {
      for (const [defName, defSchema] of Object.entries(this.definitions)) {
        this.generateDefinition(defName, defSchema);
      }
    }

    // Generate main schema
    const mainSchema = this.convertSchema(this.schema, 'root');
    
    // Add common schema imports if any were used
    if (this.usedCommonSchemas.size > 0) {
      const importNames = Array.from(this.usedCommonSchemas).map(name => `${name}Schema`).join(', ');
      this.zodCode.splice(1, 0, `import { ${importNames} } from "./common.schema"`);
    }
    
    this.zodCode.push('');
    this.zodCode.push(`export default ${mainSchema}`);
    this.zodCode.push('');

    return this.zodCode.join('\n');
  }

  private generateDefinition(name: string, schema: JSONSchema): void {
    if (this.generatedTypes.has(name)) return;
    
    // Check if this is a common schema that should be imported instead
    if (this.commonSchemas.has(name)) {
      this.usedCommonSchemas.add(name);
      this.generatedTypes.add(name);
      return;
    }
    
    this.generatedTypes.add(name);
    const zodSchema = this.convertSchema(schema, name);
    this.zodCode.push(`export const ${name}Schema = ${zodSchema}`);
    this.zodCode.push('');
  }

  private convertSchema(schema: JSONSchema, context: string = ''): string {
    if (!schema) return 'z.unknown()';

    // Handle $ref
    if (schema.$ref) {
      const refName = schema.$ref.replace('#/$defs/', '');
      
      // Check if it's a common schema
      if (this.commonSchemas.has(refName)) {
        this.usedCommonSchemas.add(refName);
        this.generatedTypes.add(refName);
        return `${refName}Schema`;
      }
      
      if (this.definitions[refName] && !this.generatedTypes.has(refName)) {
        this.generateDefinition(refName, this.definitions[refName]);
      }
      return `${refName}Schema`;
    }

    // Handle anyOf (union types)
    if (schema.anyOf) {
      const options = schema.anyOf.map((option: JSONSchema) => this.convertSchema(option, context));
      return `z.union([${options.join(', ')}])`;
    }

    // Handle oneOf (discriminated union)
    if (schema.oneOf) {
      const options = schema.oneOf.map((option: JSONSchema) => this.convertSchema(option, context));
      return `z.union([${options.join(', ')}])`;
    }

    // Handle allOf (intersection)
    if (schema.allOf) {
      const schemas = schema.allOf.map((s: JSONSchema) => this.convertSchema(s, context));
      return schemas.reduce((acc: string, curr: string) => `${acc}.and(${curr})`);
    }

    // Handle enum
    if (schema.enum) {
      return this.convertEnumSchema(schema);
    }

    // Handle different types
    switch (schema.type) {
      case 'string':
        return this.convertStringSchema(schema);
      case 'number':
      case 'integer':
        return this.convertNumberSchema(schema);
      case 'boolean':
        return this.convertBooleanSchema(schema);
      case 'array':
        return this.convertArraySchema(schema, context);
      case 'object':
        return this.convertObjectSchema(schema, context);
      case 'null':
        return 'z.null()';
    }

    // Fallback
    return 'z.unknown()';
  }

  private convertStringSchema(schema: JSONSchema): string {
    let zodString = 'z.string()';

    // Handle format
    if (schema.format) {
      switch (schema.format) {
        case 'date-time':
          zodString = 'z.string().datetime({ offset: true })';
          break;
        case 'date':
          zodString = 'z.string().date()';
          break;
        case 'time':
          zodString = 'z.string().time()';
          break;
        case 'uri':
        case 'url':
          zodString = 'z.string().url()';
          break;
        case 'email':
          zodString = 'z.string().email()';
          break;
        case 'uuid':
          zodString = 'z.string().uuid()';
          break;
        default:
          zodString = 'z.string()';
      }
    }

    // Handle length constraints
    if (schema.minLength !== undefined || schema.maxLength !== undefined) {
      if (schema.minLength !== undefined && schema.maxLength !== undefined) {
        zodString += `.min(${schema.minLength}).max(${schema.maxLength})`;
      } else if (schema.minLength !== undefined) {
        zodString += `.min(${schema.minLength})`;
      } else if (schema.maxLength !== undefined) {
        zodString += `.max(${schema.maxLength})`;
      }
    }

    // Handle pattern
    if (schema.pattern) {
      zodString += `.regex(/${schema.pattern}/)`;
    }

    return this.addOptionalAndDefault(zodString, schema);
  }

  private convertNumberSchema(schema: JSONSchema): string {
    let zodNumber = schema.type === 'integer' ? 'z.number().int()' : 'z.number()';

    if (schema.minimum !== undefined) {
      zodNumber += `.min(${schema.minimum})`;
    }
    if (schema.maximum !== undefined) {
      zodNumber += `.max(${schema.maximum})`;
    }

    return this.addOptionalAndDefault(zodNumber, schema);
  }

  private convertBooleanSchema(schema: JSONSchema): string {
    return this.addOptionalAndDefault('z.boolean()', schema);
  }

  private convertEnumSchema(schema: JSONSchema): string {
    const enumValues = schema.enum?.map((value: unknown) => 
      typeof value === 'string' ? `"${value}"` : String(value)
    ).join(', ') || '';
    
    return this.addOptionalAndDefault(`z.enum([${enumValues}])`, schema);
  }

  private convertArraySchema(schema: JSONSchema, context: string): string {
    const itemSchema = schema.items ? this.convertSchema(schema.items, `${context}_item`) : 'z.unknown()';
    let zodArray = `z.array(${itemSchema})`;

    if (schema.minItems !== undefined) {
      zodArray += `.min(${schema.minItems})`;
    }
    if (schema.maxItems !== undefined) {
      zodArray += `.max(${schema.maxItems})`;
    }

    return this.addOptionalAndDefault(zodArray, schema);
  }

  private convertObjectSchema(schema: JSONSchema, context: string): string {
    if (!schema.properties) {
      // Handle generic object with additionalProperties
      if (schema.additionalProperties === true) {
        return 'z.record(z.string(), z.unknown())';
      } else if (schema.additionalProperties && typeof schema.additionalProperties === 'object') {
        const additionalSchema = this.convertSchema(schema.additionalProperties, `${context}_additional`);
        return `z.record(z.string(), ${additionalSchema})`;
      }
      return 'z.object({})';
    }

    const properties: string[] = [];
    const required = schema.required || [];

    for (const [propName, propSchema] of Object.entries(schema.properties)) {
      const isRequired = required.includes(propName);
      let propZodSchema = this.convertSchema(propSchema as JSONSchema, `${context}_${propName}`);
      
      // Add optional if not required and doesn't have a default
      if (!isRequired && !(propSchema as JSONSchema).default) {
        propZodSchema += '.optional()';
      }

      properties.push(`"${propName}": ${propZodSchema}`);
    }

    let objectSchema = `z.object({ ${properties.join(', ')} })`;

    // Handle additionalProperties
    if (schema.additionalProperties === true) {
      objectSchema += '.passthrough()';
    } else if (schema.additionalProperties === false) {
      objectSchema += '.strict()';
    }

    return this.addOptionalAndDefault(objectSchema, schema);
  }

  private addOptionalAndDefault(zodSchema: string, schema: JSONSchema): string {
    let result = zodSchema;

    // Add default value
    if (schema.default !== undefined) {
      if (typeof schema.default === 'string') {
        result += `.default("${schema.default}")`;
      } else if (typeof schema.default === 'boolean' || typeof schema.default === 'number') {
        result += `.default(${schema.default})`;
      } else if (schema.default === null) {
        result += '.default(null)';
      } else if (Array.isArray(schema.default)) {
        result += `.default([${(schema.default as unknown[]).map((v: unknown) => typeof v === 'string' ? `"${v}"` : v).join(', ')}])`;
      } else if (typeof schema.default === 'object') {
        result += `.default(${JSON.stringify(schema.default)})`;
      }
    }

    // Add description
    if (schema.description) {
      result += `.describe("${schema.description}")`;
    }

    return result;
  }
}

export function convertJSONSchemaToZod(jsonSchema: JSONSchema): string {
  const converter = new JSONToZodConverter(jsonSchema);
  return converter.convert();
}

export function convertJSONSchemaFileToZod(inputPath: string, outputPath: string): void {
  import('fs').then(fs => {
    const jsonContent = fs.readFileSync(inputPath, 'utf-8');
    const jsonSchema = JSON.parse(jsonContent) as JSONSchema;
    
    const zodCode = convertJSONSchemaToZod(jsonSchema);
    writeFileSync(outputPath, zodCode);
    
    console.log(`✅ Converted ${inputPath} -> ${outputPath}`);
  }).catch(console.error);
}