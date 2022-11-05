export const CURRENT_PLAYER: { CIRCLE: string, CROSS: string } = {
    CIRCLE: 'O',
    CROSS: 'X'
}
export const GAME_STATUS: { NOT_STARTED: string, END_GAME: string, STARTED: string } = {
    NOT_STARTED: 'N',
    STARTED: 'S',
    END_GAME: 'E'
}
export const GAME_SIZE = 30;
export const BOARD_WIDTH = 800 + 'px';
export const ROLES_CHECK = [
    [[-2, -1, 1, 2], [-3, -2, -1, 1], [-4, -3, -2, -1]],
    [[-(GAME_SIZE * 2), -(GAME_SIZE), (GAME_SIZE), (GAME_SIZE * 2)], [-(GAME_SIZE * 3), -(GAME_SIZE * 2), -(GAME_SIZE), (GAME_SIZE)], [-(GAME_SIZE * 4), -(GAME_SIZE * 3), -(GAME_SIZE * 2), -(GAME_SIZE)]],

    [
        [-((GAME_SIZE + 1) * 2), -((GAME_SIZE + 1) * 2), ((GAME_SIZE + 1) * 2), ((GAME_SIZE + 1) * 2)],
        [-((GAME_SIZE + 1) * 3), -((GAME_SIZE + 1) * 2), -((GAME_SIZE + 1) * 2), ((GAME_SIZE + 1) * 2)],
        [-((GAME_SIZE + 1) * 4), -((GAME_SIZE + 1) * 3), -((GAME_SIZE + 1) * 2), -((GAME_SIZE + 1))],
        [-((GAME_SIZE - 1) * 2), -((GAME_SIZE - 1)), ((GAME_SIZE - 1)), ((GAME_SIZE - 1) * 2)],
        [-((GAME_SIZE - 1) * 3), -((GAME_SIZE - 1) * 2), -((GAME_SIZE - 1)), ((GAME_SIZE - 1))],
        [-((GAME_SIZE - 1) * 4), -((GAME_SIZE - 1) * 3), -((GAME_SIZE - 1) * 2), -((GAME_SIZE - 1))]
    ],
]