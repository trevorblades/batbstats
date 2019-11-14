export const STANCE_REGULAR = 'regular';
export const STANCE_GOOFY = 'goofy';

export const STANCES = [STANCE_REGULAR, STANCE_GOOFY];

export const VARIATION_SWITCH = 'switch';
export const VARIATION_NOLLIE = 'nollie';
export const VARIATION_FAKIE = 'fakie';

export const VARIATIONS = [VARIATION_SWITCH, VARIATION_NOLLIE, VARIATION_FAKIE];

export const ROSHAMBO_MOVE_ROCK = 'rock';
export const ROSHAMBO_MOVE_PAPER = 'paper';
export const ROSHAMBO_MOVE_SCISSORS = 'scissors';

export const ROSHAMBO_MOVES = [
  ROSHAMBO_MOVE_ROCK,
  ROSHAMBO_MOVE_PAPER,
  ROSHAMBO_MOVE_SCISSORS
];

export const ROSHAMBO_COUNTERS = {
  [ROSHAMBO_MOVE_ROCK]: ROSHAMBO_MOVE_PAPER,
  [ROSHAMBO_MOVE_PAPER]: ROSHAMBO_MOVE_SCISSORS,
  [ROSHAMBO_MOVE_SCISSORS]: ROSHAMBO_MOVE_ROCK
};
