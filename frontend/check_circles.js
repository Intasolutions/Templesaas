
import fs from 'fs';
import path from 'path';

const srcDir = 'src';

function getImports(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const imports = [];
    const regex = /import\s+.*?\s+from\s+['"](.*?)['"]/g;
    let match;
    while ((match = regex.exec(content)) !== null) {
        let importPath = match[1];
        if (importPath.startsWith('.')) {
            let fullPath = path.resolve(path.dirname(filePath), importPath);
            if (!fullPath.endsWith('.jsx') && !fullPath.endsWith('.js')) {
                if (fs.existsSync(fullPath + '.jsx')) fullPath += '.jsx';
                else if (fs.existsSync(fullPath + '.js')) fullPath += '.js';
                else if (fs.existsSync(path.join(fullPath, 'index.jsx'))) fullPath = path.join(fullPath, 'index.jsx');
                else if (fs.existsSync(path.join(fullPath, 'index.js'))) fullPath = path.join(fullPath, 'index.js');
            }
            if (fs.existsSync(fullPath)) {
                imports.push(fullPath);
            }
        }
    }
    return imports;
}

const graph = {};

function buildGraph(currentPath) {
    if (graph[currentPath]) return;
    graph[currentPath] = getImports(currentPath);
    for (const imp of graph[currentPath]) {
        buildGraph(imp);
    }
}

function findCircle(node, visited = new Set(), stack = new Set()) {
    visited.add(node);
    stack.add(node);

    for (const neighbor of (graph[node] || [])) {
        if (!visited.has(neighbor)) {
            const circle = findCircle(neighbor, visited, stack);
            if (circle) return [node, ...circle];
        } else if (stack.has(neighbor)) {
            return [node, neighbor];
        }
    }

    stack.delete(node);
    return null;
}

const entryPoints = [
    path.resolve('src/main.jsx'),
    path.resolve('src/App.jsx'),
];

for (const entry of entryPoints) {
    if (fs.existsSync(entry)) buildGraph(entry);
}

for (const node in graph) {
    const circle = findCircle(node);
    if (circle) {
        console.log('Circular dependency found:');
        console.log(circle.map(p => path.relative(process.cwd(), p)).join(' -> '));
        process.exit(1);
    }
}

console.log('No circular dependencies found.');
