import { COUNT_TO_WIN, fillFieldCell, getAvailableCellType, getWonCellType, isGameFinished } from './rules';
import { createGame } from './game';
import { FilledCellType } from '../models';
import { createPlayer } from './player';
import { COLUMNS_COUNT, ROWS_COUNT } from '../constants/models';

it('can be placed cross at start', () => {
  const game = createGame();
  const player1 = createPlayer();
  expect(getAvailableCellType(player1.id, game, 0, 0)).toBe(FilledCellType.Cross);
  expect(fillFieldCell(player1.id, game, 0, 0)).toBe(true);
  expect(game.field[0][0]).toBe(FilledCellType.Cross);
});

it('can be placed nought after cross', () => {
  const game = createGame();
  const player1 = createPlayer();
  fillFieldCell(player1.id, game, 0, 0);
  const player2 = createPlayer();
  expect(getAvailableCellType(player2.id, game, 0, 1)).toBe(FilledCellType.Nought);
  expect(fillFieldCell(player2.id, game, 0, 1)).toBe(true);
  expect(game.field[0][1]).toBe(FilledCellType.Nought);
});

it('can not be placed twice at the same cell', () => {
  const game = createGame();
  const player1 = createPlayer();
  fillFieldCell(player1.id, game, 0, 0);
  const player2 = createPlayer();
  expect(getAvailableCellType(player2.id, game, 0, 0)).toBe(null);
  expect(fillFieldCell(player2.id, game, 0, 0)).toBe(false);
  expect(game.field[0][0]).toBe(FilledCellType.Cross);
});

it('can not turn twice the same player', () => {
  const game = createGame();
  const player1 = createPlayer();
  fillFieldCell(player1.id, game, 0, 0);
  expect(getAvailableCellType(player1.id, game, 0, 1)).toBe(null);
  expect(fillFieldCell(player1.id, game, 0, 1)).toBe(false);
  expect(game.field[0][1]).toBe(null);
});

it('not win at start', () => {
  const game = createGame();
  expect(getWonCellType(game)).toBe(null);
});

it('not win if not win', () => {
  const game = createGame();
  const player1 = createPlayer();
  fillFieldCell(player1.id, game, 0, 0);
  expect(getWonCellType(game)).toBe(null);
});

it('can not win vertical with different tokens', () => {
  const game = createGame();
  for (let i = 0; i < COUNT_TO_WIN; i++) {
    game.field[i][0] = FilledCellType.Cross
  }
  for (let i = 0; i < COUNT_TO_WIN; i += 2) {
    game.field[i][0] = FilledCellType.Nought
  }
  expect(getWonCellType(game)).toBe(null);
});

it('can win vertical', () => {
  const game = createGame();
  for (let i = 0; i < COUNT_TO_WIN; i++) {
    game.field[i][0] = FilledCellType.Cross
  }
  expect(getWonCellType(game)).toBe(FilledCellType.Cross);
});

it('can not win horizontal with different tokens', () => {
  const game = createGame();
  for (let i = 0; i < COUNT_TO_WIN; i++) {
    game.field[0][i] = FilledCellType.Cross
  }
  for (let i = 0; i < COUNT_TO_WIN; i += 2) {
    game.field[0][i] = FilledCellType.Nought
  }
  expect(getWonCellType(game)).toBe(null);
});

it('can win horizontal', () => {
  const game = createGame();
  for (let i = 0; i < COUNT_TO_WIN; i++) {
    game.field[0][i] = FilledCellType.Nought
  }
  expect(getWonCellType(game)).toBe(FilledCellType.Nought);
});

it('can not win diagonal with different tokens', () => {
  const game = createGame();
  for (let i = 0, j = 0; i < COUNT_TO_WIN; i++, j++) {
    game.field[i][j] = FilledCellType.Cross
  }
  for (let i = 0, j = 0; i < COUNT_TO_WIN; i += 2, j += 2) {
    game.field[i][j] = FilledCellType.Nought
  }
  expect(getWonCellType(game)).toBe(null);
});

it('can win main diagonal', () => {
  const game = createGame();
  for (let i = 0, j = 0; i < COUNT_TO_WIN; i++, j++) {
    game.field[i][j] = FilledCellType.Cross
  }
  expect(getWonCellType(game)).toBe(FilledCellType.Cross);
});

it('can not win second diagonal with different tokens', () => {
  const game = createGame();
  for (let i = COUNT_TO_WIN - 1, j = 0; i >= 0; i--, j++) {
    game.field[i][j] = FilledCellType.Nought
  }
  for (let i = COUNT_TO_WIN - 1, j = 0; i >= 0; i -= 2, j += 2) {
    game.field[i][j] = FilledCellType.Cross
  }
  expect(getWonCellType(game)).toBe(null);
});

it('can win second diagonal', () => {
  const game = createGame();
  for (let i = COUNT_TO_WIN - 1, j = 0; i >= 0; i--, j++) {
    game.field[i][j] = FilledCellType.Nought
  }
  expect(getWonCellType(game)).toBe(FilledCellType.Nought);
});

it('finished after all is filled', () => {
  const game = createGame();
  for (let i = 0; i < ROWS_COUNT; i++) {
    for (let j = 0; j < COLUMNS_COUNT; j++) {
      game.field[i][j] = FilledCellType.Nought
    }
  }
  for (let i = 0; i < ROWS_COUNT / 2; i++) {
    for (let j = i % 2; j < COLUMNS_COUNT; j +=2) {
      game.field[i * 2][j] = FilledCellType.Cross;
      game.field[i * 2 + 1][j] = FilledCellType.Cross;
    }
  }
  expect(getWonCellType(game)).toBe(null);
  expect(isGameFinished(game)).toBe(true);
  game.field[0][0] = null;
  expect(isGameFinished(game)).toBe(false);
});
