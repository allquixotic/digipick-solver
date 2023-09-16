# digipick

## Description

This is an implementation of a solver for the Digipick mini-game from the Bethesda game Starfield (2023).

## Game Rules

In digipick, you have to fill in the holes in a series of concentric rings in a futuristic lock. Every ring has 32 positions, each of which is either filled or empty. You have to fill the rings in order, from the outermost to the innermost ring.

To fill the holes in a ring, you have to rotate a "pick" so that all of its pins align with holes in the current outermost ring. A pick consists of one or more pins that are offset by a fixed amount. The amount of space between the pins in a pick can't be modified, but you can rotate the pick around the ring until it aligns with the holes. Every single pin in a pick must be aligned with a hole before it can be used. Once a pick is used, it cannot be used again -- it is consumed.

Once all the holes in a ring are filled with pins, that ring disappears and you must then solve the next innermost ring.

It is possible to get into a state where you used the wrong picks to pick an outer ring, and no longer have the picks available to pick the current ring. In this case, the game cannot be solved, and the player must either backtrack by undoing their previous moves, or concede defeat. Not all picks may be needed to solve any given game.

There can be between 1 and 5 rings, and there will be between 1 and 12 picks for any given game. Each ring will start with at least 1 hole, up to 31 holes.

The goal of the function is to calculate a correct solution that fills all the holes using the available picks, or prints out that no solution exists if the algorithm concludes that the picks available can't fill in all the holes.

## Usage

It may be possible to use this tool with NodeJS, but it is tested with the new runtime [Bun](https://bun.sh). Instructions are not provided for obtaining a copy of Bun, as these are documented on the Bun website. If you have NodeJS and not Bun, you should be able to use this tool just the same.

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run digipick.js
```

Usage information will be printed to the command line if you run without any arguments.

This project was created using `bun init` in bun v1.0.2. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.
