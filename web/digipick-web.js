import { solveIterative, formatPrettyOutput, convertToRingFormat } from 'digipick-engine';
var picks = [];
var holes = [];

function addPick() {
    const pickHtml = `
            <div class="pick">
                <hr/>
                <button class="btn btn-danger" onclick="removePick(${picks.length})">Remove</button>
                <input type="text" class="form-control pick-positions">
            </div>
            `;

    $('#picks').append(pickHtml);
}

function addRing() {
    const ringHtml = `
            <div class="ring">
                <hr/>
                <button class="btn btn-danger" onclick="removeRing(${holes.length})">Remove</button>
                <input type="text" class="form-control ring-holes">
            </div>
            `;
    $('#rings').append(ringHtml);
}

function removePick(index) {
    $('.pick').eq(index).remove();
}

function removeRing(index) {
    $('.ring').eq(index).remove();
}

function solve() {

    picks = [];
    holes = [];

    // Extract picks
    $('.pick-positions').map(function() {
        // Get text of the current element, split by comma, trim and convert to Number
        picks.push($(this).val().split(',').map(item => Number(item.trim())));
    });

    // Extract rings 
    $('.ring-holes').map(function() {
        // Get text of the current element, split by comma, trim and convert to Number
        holes.push($(this).val().split(',').map(item => Number(item.trim())));
    });

    let rings = holes.map(holeList => convertToRingFormat(holeList));

    console.log(`picks=${JSON.stringify(picks, null, 4)}, rings=${JSON.stringify(holes, null, 4)}`);

    // Call solver
    const solution = solveIterative(rings, picks);

    // Display output
    const output = formatPrettyOutput(solution);
    $('#output').text(output);
}

export { addPick, addRing, removePick, removeRing, solve };

window.addPick = addPick;
window.addRing = addRing;
window.removePick = removePick;
window.removeRing = removeRing;
window.solve = solve;
