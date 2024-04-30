import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

const [, fileLocation, fileName] = process.argv;

if (!fileName) {
    const command = `ts-node-esm ${path.relative(process.cwd(), fileLocation)}`;

    console.error('Usage:');
    console.error(`\t$ ${command} <file-name>`);
    console.error('');
    console.error('Example:');
    console.error(`\t$ echo "more contents!" >> ${command} ./release-notes.md`);
    console.error(`\t$ ${command} $GITHUB_STEP_SUMMARY <<"EOF"`);
    console.error(`\t  multi-line`);
    console.error(`\t  content`);
    console.error(`\t  EOF`);
    process.exit(1);
}

const releaseNotesLines: string[] = [];

process.stdin.on('data', data => {
    releaseNotesLines.push(data.toString());
});

process.stdin.on('end', () => {
    const directory = path.dirname(fileName);

    if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory, { recursive: true });
    }

    fs.appendFileSync(fileName, releaseNotesLines.join(os.EOL), 'utf-8');
});
