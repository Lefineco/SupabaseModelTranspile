const { Command } = require('commander');
const { version } = require('./package.json');
const { exec } = require('child_process');
const fs = require('fs');

const program = new Command();

function createDirectory(path) {
    try {
        fs.mkdirSync(path, { recursive: true });
        console.log(`Directory created: ${path}`);
    } catch (err) {
        console.error(`Error creating directory: ${path}\n${err.message}`);
    }
}

function writeToFile(filePath, content) {
    try {
        fs.writeFileSync(filePath, content);
        console.log(`File written: ${filePath}`);
    } catch (err) {
        console.error(`Error writing to file: ${filePath}\n${err.message}`);
    }
}

function SupabaseGen(projectId) {
    const outputPath = './transpile/supabase_transpile.ts';

    createDirectory('./transpile');
    writeToFile(outputPath, '');

    return `npx supabase gen types typescript --project-id ${projectId} --schema public > ${outputPath}`;
}

function DartGen() {
    const inputPath = './transpile/supabase_transpile.ts';

    fs.readFile(inputPath, 'utf8', (err, data) => {
        if (err) {
            console.error(`Error reading file: ${inputPath}\n${err.message}`);
            return;
        }

        exec(`npx ts2dart ${inputPath}`, (error) => {
            if (error) {
                console.error(`Error transpiling to Dart: ${error.message}`);
                return;
            }

            console.log('Transpiling Supabase Types to Dart Models...');
        });
    });
}

program
    .version(version)
    .description('A tool for generating Supabase types and transpiling them to Dart models');

program
    .command('supabase-gen <projectId>')
    .description('Generate Supabase typescript types')
    .action(SupabaseGen);

program
    .command('dart-gen')
    .description('Transpile Supabase types to Dart models')
    .action(DartGen);

program.parse(process.argv);
