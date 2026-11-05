import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import test from 'node:test';

test('uses a CSS entry point under src without Sass', () => {
    const html = readFileSync(new URL('../src/index.html', import.meta.url), 'utf8');
    const css = readFileSync(new URL('../src/styles.css', import.meta.url), 'utf8');
    const packageJson = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));

    assert.match(html, /href="\.\/styles\.css"/);
    assert.doesNotMatch(html, /\.scss/);
    assert.doesNotMatch(css, /\$primary-color/);
    assert.equal(packageJson.devDependencies.sass, undefined);
    assert.equal(existsSync(new URL('../index.html', import.meta.url)), false);
    assert.equal(existsSync(new URL('../src/styles/main.scss', import.meta.url)), false);
});
