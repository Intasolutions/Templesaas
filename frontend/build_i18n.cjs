const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');
const i18nFile = path.join(srcDir, 'i18n.js');

// 1. Gather all files
function getAllFiles(dirPath, arrayOfFiles) {
    const files = fs.readdirSync(dirPath);
    arrayOfFiles = arrayOfFiles || [];
    files.forEach((file) => {
        if (fs.statSync(dirPath + "/" + file).isDirectory()) {
            arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
        } else {
            if (file.endsWith('.jsx') || file.endsWith('.js')) {
                arrayOfFiles.push(path.join(dirPath, "/", file));
            }
        }
    });
    return arrayOfFiles;
}

const allFiles = getAllFiles(srcDir);

// 2. Extract t('key', 'default value') calls
const keysExtracted = {};

allFiles.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    // Regex to match t('key', 'default_value') or t("key", "default_value")
    // Allows optional spaces
    const regex = /t\(['"]([^'"]+)['"]\s*,\s*['"]([^'"]+)['"]\)/g;
    let match;
    while ((match = regex.exec(content)) !== null) {
        const key = match[1];
        const defaultVal = match[2];
        if (!keysExtracted[key]) {
            keysExtracted[key] = defaultVal;
        }
    }
});

console.log(`Found ${Object.keys(keysExtracted).length} unique translation keys in the codebase.`);

// 3. Read current i18n.js and parse English keys
const i18nContent = fs.readFileSync(i18nFile, 'utf8');

// A very unsafe/simple regex just to find existing english keys to compare.
// If an english key is MISSING from i18n completely, we need to add it.
const missingKeys = {};
for (const [key, defaultVal] of Object.entries(keysExtracted)) {
    if (!i18nContent.includes(`"${key}":`) && !i18nContent.includes(`'${key}':`)) {
        missingKeys[key] = defaultVal;
    }
}

const missingCount = Object.keys(missingKeys).length;

if (missingCount === 0) {
    console.log("No missing keys found in i18n.js! Everything is up to date.");
} else {
    console.log(`Missing ${missingCount} keys in i18n.js! Example:`);
    console.log(Object.entries(missingKeys).slice(0, 5));

    // Auto-generate block for user to copy-paste
    let out = `\n// --- ADD THESE TO YOUR i18n.js (under en: translation) ---\n`;
    for (const [k, v] of Object.entries(missingKeys)) {
        out += `"${k}": "${v}",\n`;
    }
    fs.writeFileSync('missing_translations.txt', out);
    console.log("Wrote missing keys to 'missing_translations.txt'");
}
