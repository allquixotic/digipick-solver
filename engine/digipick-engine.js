function convertToRingFormat(holes) {
    let ring = Array(32).fill(1);
    for (let hole of holes) {
        ring[hole] = 0;
    }
    return ring;
}

function canUsePick(ring, pick, position) {
    for (let offset of pick) {
        if (ring[(position + offset) % 32] === 1) {
            return false;
        }
    }
    return true;
}

function applyPick(ring, pick, position) {
    let newRing = [...ring];
    for (let offset of pick) {
        newRing[(position + offset) % 32] = 1;
    }
    return newRing;
}

function optimalPickRotation(ring, pick) {
    let bestShift = { direction: null, amount: 32 }; // initialize with max amount
    for (let position = 0; position < 32; position++) {
        if (canUsePick(ring, pick, position)) {
            let shiftRight = position;
            let shiftLeft = 32 - position;
            let optimalShift = shiftRight <= shiftLeft ? { direction: "right", amount: shiftRight } : { direction: "left", amount: shiftLeft };
            if (optimalShift.amount < bestShift.amount) {
                bestShift = optimalShift;
            }
        }
    }
    return bestShift.direction ? bestShift : null;
}

function applyPickWithDirection(ring, pick, direction, amount) {
    let position = direction === "right" ? amount : 32 - amount;
    return applyPick(ring, pick, position);
}

function solveIterative(rings, picks) {
    let stack = [{ rings, picks, ringIndex: 0, solution: [] }];
    
    while (stack.length) {
        const { rings: currRings, picks: currPicks, ringIndex: currRingIndex, solution: currSolution } = stack.pop();

        if (currRings.length === 0) {
            return currSolution;
        }

        let currentRing = currRings[0];

        if (currentRing.every(val => val === 1)) {
            stack.push({ rings: currRings.slice(1), picks: currPicks, ringIndex: currRingIndex + 1, solution: currSolution });
            continue;
        }

        for (let i = 0; i < currPicks.length; i++) {
            let pick = currPicks[i];
            let optimalRotation = optimalPickRotation(currentRing, pick);
            if (optimalRotation) {
                let updatedRing = applyPickWithDirection(currentRing, pick, optimalRotation.direction, optimalRotation.amount);
                let newSolutionItem = {
                    ring_index: currRingIndex,
                    pins: pick,
                    direction: optimalRotation.direction,
                    amount: optimalRotation.amount
                };
                let newSolution = [...currSolution, newSolutionItem];
                if (updatedRing.every(val => val === 1)) {
                    stack.push({ rings: currRings.slice(1), picks: [...currPicks.slice(0, i), ...currPicks.slice(i+1)], ringIndex: currRingIndex + 1, solution: newSolution });
                } else {
                    stack.push({ rings: [updatedRing, ...currRings.slice(1)], picks: [...currPicks.slice(0, i), ...currPicks.slice(i+1)], ringIndex: currRingIndex, solution: newSolution });
                }
            }
        }
    }

    return null;
}

function formatJsonOutput(solution) {
    if (solution === null) {
        return "{ \"Result\": \"No solution found.\" }";
    }
    else {
        return JSON.stringify(solution, null, 4);
    }
}

function formatPrettyOutput(solution) {
    let output = "";
    let currentRingIndex = -1;
    if (solution == null)
        return "No solution found.";
    for (let item of solution) {
        if (item.ring_index !== currentRingIndex) {
            if (currentRingIndex !== -1) {
                output += "\n";  // Separate different rings with a newline
            }
            currentRingIndex = item.ring_index;
            output += `For the ${ordinalSuffix(currentRingIndex + 1)} ring:\n`;
        }
        
        output += `  - Rotate the pick with pins at positions ${item.pins.join(", ")} to the ${item.direction} by ${item.amount} positions.\n`;
    }
    return output;
}

function ordinalSuffix(num) {
    let j = num % 10;
    let k = num % 100;
    if (j === 1 && k !== 11) {
        return num + "st";
    }
    if (j === 2 && k !== 12) {
        return num + "nd";
    }
    if (j === 3 && k !== 13) {
        return num + "rd";
    }
    return num + "th";
}

export { solveIterative, formatPrettyOutput, convertToRingFormat, formatJsonOutput };