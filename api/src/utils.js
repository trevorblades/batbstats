export const STANCE_REGULAR = 'regular';
export const STANCE_GOOFY = 'goofy';

export const STANCES = [STANCE_REGULAR, STANCE_GOOFY];

export const VARIATION_SWITCH = 'switch';
export const VARIATION_NOLLIE = 'nollie';
export const VARIATION_FAKIE = 'fakie';

export const VARIATIONS = [VARIATION_SWITCH, VARIATION_NOLLIE, VARIATION_FAKIE];

export const MOVE_ROCK = 'rock';
export const MOVE_PAPER = 'paper';
export const MOVE_SCISSORS = 'scissors';

export const MOVES = [MOVE_ROCK, MOVE_PAPER, MOVE_SCISSORS];

export const COUNTERS = {
  [MOVE_ROCK]: MOVE_PAPER,
  [MOVE_PAPER]: MOVE_SCISSORS,
  [MOVE_SCISSORS]: MOVE_ROCK
};
