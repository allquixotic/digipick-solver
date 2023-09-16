const fs = require('fs');
const minimist = require('minimist');
import { solveIterative, formatPrettyOutput, formatJsonOutput, convertToRingFormat } from 'digipick-engine';

function displayHelp() {
    console.log(`
Usage: bun run digipick.js [OPTIONS]

Options:
  --picks <picks>       Specify picks directly. E.g. --picks "[[0,6],[0]]"
  --rings <rings>       Specify holes in the rings directly. E.g. --rings "[[4,6,10],[22,24,26]]"
  --file <path>         Path to JSON file containing picks and rings.
  --stdin               Read JSON input from stdin.
  -h, --help, --usage   Display this help and exit.

Example:
  bun run digipick.js --picks "[[0,6],[0]]" --rings "[[4,6,10],[22,24,26]]"
  cat path_to_file.json | bun run digipick.js --stdin
    `);
}

function main() {
    let sliceIndex = process.argv.findIndex(arg => arg.startsWith('--'));
    if (sliceIndex === -1 || ['--help', '-h', '--usage'].includes(process.argv[sliceIndex])) {
        displayHelp();
        return;
    }

    const args = minimist(process.argv.slice(sliceIndex));

    let picks, rings;

    if (args.stdin) {
        const inputData = fs.readFileSync(0, 'utf-8');
        const data = JSON.parse(inputData);
        picks = data.picks;
        rings = data.rings.map(convertToRingFormat);
    } else if (args.file) {
        const filePath = args.file;
        const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        picks = data.picks;
        rings = data.rings.map(convertToRingFormat);
    } else {
        picks = JSON.parse(args.picks);
        rings = JSON.parse(args.rings).map(convertToRingFormat);
    }

    const solution = solveIterative(rings, picks);
    if (args.pretty || args.p) {
        console.log(formatPrettyOutput(solution));
    } else {
        console.log(formatJsonOutput(solution));
    }
}

if (require.main === module) {
    // The script is being run directly
    main();
}

