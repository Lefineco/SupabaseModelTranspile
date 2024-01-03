const { Command } = require('commander');
const { version } = require('./package.json');
const { exec } = require('child_process');

const fs = require('fs');
const program = new Command();

function SupabaseGen(id) {
    fs.mkdirSync('./transpile', { recursive: true })
    fs.writeFileSync('./transpile/supabase_transpile.ts', '');

    return `npx supabase gen types typescript --project-id ${id} --schema public > ./transpile/supabase_transpile.ts`;
}

function DartGen() {
    fs.readFile('./transpile/supabase_transpile.ts', 'utf8', function (err, data) {
        if (err) {
            return console.log(err);
        }

        exec('npx ts2dart ./transpile/supabase_transpile.ts', (error) => {
            if (error) {
                console.log(`error: ${error.message}`);
                return;
            }

            console.log('Transpiling Supabase Types to Dart Models...');
        });
    });
}

program
    .name('Supabase Type Transpiler')
    .description('Supabase Dart Model Generator')
    .version(version);

program.command('transpile')
    .description('Transpile Supabase Types to Dart Models')
    .argument('<Supabase Project ID>', 'string to split')
    .action((id) => {
        exec(SupabaseGen(id), (error) => {
            if (error) {
                console.log(`error: ${error.message}`);
                return;
            }

            DartGen()
        });
    });

program.parse();