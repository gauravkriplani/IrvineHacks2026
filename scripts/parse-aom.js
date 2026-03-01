/**
 * parse-aom.js — AOM (Agentic Object Model) AST Parser
 *
 * Scans all JSX/TSX files in the dummy-website src/ directory.
 * ONLY extracts elements wrapped in: <AOMAction>, <AOMInput>, <AOMLink>
 * Outputs:
 *   - agent-surface.json   (full machine-readable contract)
 *   - ai-pages/<Page>.txt  (one human+agent readable file per page/component)
 *
 * No AI needed — fully deterministic. Props are the source of truth.
 */

import { parse } from '@babel/parser';
import _traverse from '@babel/traverse';
import { glob } from 'glob';
import fs from 'fs-extra';
import path from 'path';

const traverse = _traverse.default ?? _traverse;

// ─── Config ───────────────────────────────────────────────────────────────────
// Pass target source directory as: node parse-aom.js --src ./my-app/src
const srcArgIndex = process.argv.indexOf('--src');
const SRC_ROOT = srcArgIndex !== -1 ? process.argv[srcArgIndex + 1] : null;

if (!SRC_ROOT) {
    console.error('❌ Usage: node parse-aom.js --src <path/to/src>');
    console.error('   Example: node parse-aom.js --src ./dummy-website/src/with-custom-components/src');
    process.exit(1);
}

const AOM_OUTPUT_DIR = './aom-output';
const OUTPUT_JSON = `${AOM_OUTPUT_DIR}/agent-surface.json`;
const OUTPUT_PAGES_DIR = `${AOM_OUTPUT_DIR}/ai-pages`;
const AOM_WRAPPERS = new Set(['AOMAction', 'AOMInput', 'AOMLink']);

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Extract a string/number/bool literal from a JSX attribute value node */
function extractPropValue(valueNode) {
    if (!valueNode) return true; // bare prop => true
    if (valueNode.type === 'StringLiteral') return valueNode.value;
    if (valueNode.type === 'NumericLiteral') return valueNode.value;
    if (valueNode.type === 'BooleanLiteral') return valueNode.value;
    if (valueNode.type === 'JSXExpressionContainer') {
        const expr = valueNode.expression;
        if (expr.type === 'StringLiteral') return expr.value;
        if (expr.type === 'NumericLiteral') return expr.value;
        if (expr.type === 'BooleanLiteral') return expr.value;
        if (expr.type === 'TemplateLiteral' && expr.quasis.length === 1) {
            return expr.quasis[0].value.cooked;
        }
        // For expressions like `feed.follow_suggested.${user.username}` we get partial
        if (expr.type === 'TemplateLiteral') {
            const parts = expr.quasis.map(q => q.value.cooked);
            return parts.join('{...}');
        }
    }
    return null;
}

/** Extract all props from a JSXOpeningElement into a plain object */
function extractProps(jsxOpeningElement) {
    const props = {};
    for (const attr of jsxOpeningElement.attributes) {
        if (attr.type !== 'JSXAttribute') continue;
        const key = attr.name.name ?? attr.name.value;
        props[key] = extractPropValue(attr.value);
    }
    return props;
}

/** Derive the component name that wraps this node, by walking up parents */
function getEnclosingComponent(nodePath) {
    let p = nodePath.parentPath;
    while (p) {
        if (
            (p.node.type === 'FunctionDeclaration' || p.node.type === 'FunctionExpression' || p.node.type === 'ArrowFunctionExpression') &&
            p.parentPath &&
            (p.parentPath.node.type === 'VariableDeclarator' || p.parentPath.node.type === 'ExportDefaultDeclaration')
        ) {
            const id = p.parentPath.node.id ?? p.node.id ?? p.parentPath.node.declaration?.id;
            if (id?.name) return id.name;
        }
        if (p.node.type === 'ExportDefaultDeclaration' && p.node.declaration?.id?.name) {
            return p.node.declaration.id.name;
        }
        p = p.parentPath;
    }
    return 'Unknown';
}

// ─── Main ─────────────────────────────────────────────────────────────────────
async function parseAOM() {
    console.log('🔍 AOM Parser starting…');

    const files = await glob(`${SRC_ROOT}/**/*.{js,jsx,ts,tsx}`, {
        ignore: ['**/*.test.*', '**/*.spec.*', '**/node_modules/**'],
    });

    console.log(`   Found ${files.length} source files`);

    const actions = [];
    /** Map of page/component name → array of action entries for text output */
    const pageMap = {};

    for (const file of files) {
        const code = await fs.readFile(file, 'utf8');
        let ast;
        try {
            ast = parse(code, {
                sourceType: 'module',
                plugins: ['jsx', 'typescript'],
                errorRecovery: true,
            });
        } catch {
            console.warn(`   ⚠ Could not parse ${file} — skipping`);
            continue;
        }

        traverse(ast, {
            JSXOpeningElement(nodePath) {
                const nameNode = nodePath.node.name;
                const componentName =
                    nameNode.type === 'JSXIdentifier' ? nameNode.name :
                        nameNode.type === 'JSXMemberExpression' ? `${nameNode.object.name}.${nameNode.property.name}` :
                            '';

                if (!AOM_WRAPPERS.has(componentName)) return;

                const props = extractProps(nodePath.node);
                const enclosing = getEnclosingComponent(nodePath);
                const relFile = path.relative(process.cwd(), file);

                // Determine kind from wrapper type
                const kind =
                    componentName === 'AOMAction' ? 'action' :
                        componentName === 'AOMInput' ? 'input' :
                            'link';

                if (!props.id) {
                    console.warn(`   ⚠ AOM element missing 'id' prop in ${relFile}`);
                    return;
                }

                const entry = {
                    action_id: props.id,
                    kind,
                    component: enclosing,
                    file: relFile,
                    description: props.description ?? '',
                    permission: props.permission ?? (kind === 'link' ? 'public' : 'user'),
                    safety_score: props.safety ?? (kind === 'input' ? 0.95 : 0.9),
                    needs_review: props.needsReview ?? false,
                    ...(kind === 'input' && { input_type: props.inputType ?? 'text' }),
                    ...(kind === 'link' && { destination: props.destination ?? '' }),
                    ...(props.group && { group: props.group }),
                };

                actions.push(entry);

                // Group by component (page) for text output
                if (!pageMap[enclosing]) pageMap[enclosing] = [];
                pageMap[enclosing].push(entry);
            },
        });
    }

    // Sort deterministically by action_id
    actions.sort((a, b) => a.action_id.localeCompare(b.action_id));

    await fs.ensureDir(AOM_OUTPUT_DIR);
    await fs.ensureDir(OUTPUT_PAGES_DIR);

    // ── 1. Write agent-surface.json ──────────────────────────────────────────
    const contract = {
        version: '1.0',
        generated_at: new Date().toISOString(),
        total_actions: actions.length,
        actions,
    };

    await fs.writeFile(OUTPUT_JSON, JSON.stringify(contract, null, 2));
    console.log(`\n✅ agent-surface.json → ${actions.length} actions extracted`);

    // ── 2. Write ai-pages/<Component>.txt ────────────────────────────────────
    for (const [pageName, pageActions] of Object.entries(pageMap)) {
        const lines = [
            `# AOM Surface — ${pageName}`,
            `Generated: ${new Date().toISOString()}`,
            `Actions: ${pageActions.length}`,
            '',
        ];

        for (const a of pageActions) {
            lines.push(`## ${a.action_id}`);
            lines.push(`Kind:        ${a.kind}`);
            lines.push(`Description: ${a.description}`);
            lines.push(`Permission:  ${a.permission}`);
            lines.push(`Safety:      ${a.safety_score}`);
            lines.push(`Review:      ${a.needs_review}`);
            if (a.input_type) lines.push(`Input type:  ${a.input_type}`);
            if (a.destination) lines.push(`Destination: ${a.destination}`);
            if (a.group) lines.push(`Group:       ${a.group}`);
            lines.push(`File:        ${a.file}`);
            lines.push('');
        }

        const txtPath = path.join(OUTPUT_PAGES_DIR, `${pageName}.txt`);
        await fs.writeFile(txtPath, lines.join('\n'));
        console.log(`   📄 ai-pages/${pageName}.txt`);
    }

    console.log('\n✅ Done. AOM surface extracted successfully.');
    console.log(`   agent-surface.json — ${actions.length} total actions`);
    console.log(`   ai-pages/          — ${Object.keys(pageMap).length} page files`);
}

parseAOM().catch(err => {
    console.error('❌ Parser error:', err.message);
    process.exit(1);
});
