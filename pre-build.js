// load package.json
const fs = require('fs');
const path = require('path');

const packageJsonPath = path.join(__dirname, 'package.json');
const versionJsonPath = path.join(__dirname, 'src', 'content', 'version.json');

const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
const version = packageJson.version || '0.0.0';

// create version.json content
const versionJsonContent = {
  version: version,
  buildDate: new Date().toISOString(),
};

// write version.json file
fs.writeFileSync(
  versionJsonPath,
  JSON.stringify(versionJsonContent, null, 2),
  'utf8'
);

console.log(`Version ${version} written to ${versionJsonPath}`);
