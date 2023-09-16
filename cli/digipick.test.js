import { expect, test, describe } from "bun:test";
const fs = require('fs');
const path = require('path');
import { solveIterative, formatPrettyOutput, formatJsonOutput, convertToRingFormat } from 'digipick-engine';

describe("Digipick Game Solver", () => {
    const testDir = path.join(import.meta.dir, 'tests');
    const gameDirs = fs.readdirSync(testDir).filter(dir => dir.endsWith('_game'));

    gameDirs.forEach(gameDir => {
        const gameName = gameDir.split('_game')[0];

        test(`Should solve the ${gameName} game correctly`, () => {
            // Read input and expected outputs
            const input = JSON.parse(fs.readFileSync(path.join(testDir, gameDir, `${gameName}_game_input.json`), 'utf-8'));
            const expectedJsonOutput = fs.readFileSync(path.join(testDir, gameDir, `${gameName}_game_output.json`), 'utf-8').trim();
            const expectedPrettyOutput = fs.readFileSync(path.join(testDir, gameDir, `${gameName}_game_pretty_output.txt`), 'utf-8').trim();

            // Solve the game
            const solution = solveIterative(input.rings.map(convertToRingFormat), input.picks);
            const jsonSolution = formatJsonOutput(solution).trim();
            const prettySolution = formatPrettyOutput(solution).trim();

            // Assertions
            expect(jsonSolution).toEqual(expectedJsonOutput);
            expect(prettySolution).toEqual(expectedPrettyOutput);
        });
    });
});