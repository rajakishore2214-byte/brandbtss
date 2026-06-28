const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const target = process.argv[2];
if (target !== 'sqlite' && target !== 'postgres' && target !== 'postgresql') {
  console.log('Usage: node scripts/switch-db.js <sqlite|postgres>');
  process.exit(1);
}

const isSqlite = target === 'sqlite';
const projectRoot = path.join(__dirname, '..');
const schemaPath = path.join(projectRoot, 'prisma', 'schema.prisma');
const envPath = path.join(projectRoot, '.env');

console.log(`Switching database provider to: ${isSqlite ? 'SQLite' : 'PostgreSQL'}`);

// 1. Update schema.prisma
if (!fs.existsSync(schemaPath)) {
  console.error(`Error: schema.prisma not found at ${schemaPath}`);
  process.exit(1);
}

let schema = fs.readFileSync(schemaPath, 'utf8');
const pgMatch = /provider\s*=\s*"postgresql"/;
const sqMatch = /provider\s*=\s*"sqlite"/;

if (isSqlite) {
  schema = schema.replace(pgMatch, 'provider = "sqlite"');
} else {
  schema = schema.replace(sqMatch, 'provider = "postgresql"');
}
fs.writeFileSync(schemaPath, schema, 'utf8');
console.log('✔ Updated prisma/schema.prisma');

// 2. Update .env file
if (!fs.existsSync(envPath)) {
  console.error(`Error: .env not found at ${envPath}`);
  process.exit(1);
}

let envContent = fs.readFileSync(envPath, 'utf8');

if (isSqlite) {
  // Update to sqlite file:./dev.db
  if (envContent.includes('DATABASE_URL="postgresql://')) {
    envContent = envContent.replace(
      /DATABASE_URL="postgresql:\/\/([^"]+)"/,
      '# DATABASE_URL="postgresql://$1"'
    );
  }
  // Ensure the sqlite line is set
  if (envContent.includes('DATABASE_URL="file:')) {
    envContent = envContent.replace(/#?\s*DATABASE_URL="file:([^"]+)"/, 'DATABASE_URL="file:$1"');
  } else {
    envContent = 'DATABASE_URL="file:./dev.db"\n' + envContent;
  }
} else {
  // Update to postgresql
  if (envContent.includes('DATABASE_URL="file:')) {
    envContent = envContent.replace(/DATABASE_URL="file:([^"]+)"/, '# DATABASE_URL="file:$1"');
  }
  // Restore/uncomment postgresql connection string
  if (envContent.includes('# DATABASE_URL="postgresql://')) {
    envContent = envContent.replace(
      /#\s*DATABASE_URL="postgresql:\/\/([^"]+)"/,
      'DATABASE_URL="postgresql://$1"'
    );
  } else if (!envContent.includes('DATABASE_URL="postgresql://')) {
    envContent = 'DATABASE_URL="postgresql://username:password@hostname:5432/dbname?sslmode=require"\n' + envContent;
  }
}

fs.writeFileSync(envPath, envContent, 'utf8');
console.log('✔ Updated .env');

// 3. Re-run prisma generate
try {
  console.log('Running prisma generate...');
  execSync('npx.cmd prisma generate', { cwd: projectRoot, stdio: 'inherit' });
  console.log('✔ Re-generated Prisma Client successfully!');
} catch (e) {
  console.error('Failed to run prisma generate:', e.message);
}
