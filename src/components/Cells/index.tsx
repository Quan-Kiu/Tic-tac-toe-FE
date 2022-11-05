import { throttle } from 'lodash';
import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CURRENT_PLAYER, GAME_SIZE, GAME_STATUS, ROLES_CHECK } from '../../constant';
import { RootState } from '../../store';
import { cellClick, setCurrentPlayer, setWinGame } from '../../store/gameSlice';
import { confirmAlertModal } from '../../utils/confirmAlert';
import CellComponent from '../Cell';

const CellsComponent = () => {
    const socket = useSelector((state: RootState) => state.socket);
    const dispatch = useDispatch();
    const { cellValues, winPosition, currentPlayer, cellSelect, me, competitor, winner, gameStatus } = useSelector((state: RootState) => state.game);

    const getWinPosition = (cellIndex: number) => {
        const valueCheck = cellValues[cellIndex];
        let winPosition: number[] = [];
        let roleIndexWin: number | null = null;


        ROLES_CHECK.some((role, index) => {
            role.some((v) => {
                let firstCell = cellIndex + v[0];
                let secondCell = cellIndex + v[1];
                let thirdCell = cellIndex + v[2];
                let fourthCell = cellIndex + v[3];

                let mapCheck = new Set([cellValues[firstCell], cellValues[secondCell], cellValues[thirdCell], cellValues[fourthCell]]);
                if (mapCheck.has(valueCheck) && !mapCheck.has("") && mapCheck.size === 1) {
                    roleIndexWin = index;
                    winPosition = [firstCell, secondCell, thirdCell, fourthCell, cellIndex];
                    return true;
                };

                firstCell = cellIndex - v[0];
                secondCell = cellIndex - v[1];
                thirdCell = cellIndex - v[2];
                fourthCell = cellIndex - v[3];

                mapCheck = new Set([cellValues[firstCell], cellValues[secondCell], cellValues[thirdCell], cellValues[fourthCell]]);
                if (mapCheck.has(valueCheck) && !mapCheck.has("") && mapCheck.size === 1) {
                    winPosition = [firstCell, secondCell, thirdCell, fourthCell, cellIndex];
                    roleIndexWin = index;
                    return true;
                };
                return false;
            })
            if (winPosition.length) {
                return true;
            }
            return false;

        })

        return { winPosition, roleIndexWin };

    }

    const checkWin = useCallback((cellIndex: number) => {

        const { winPosition, roleIndexWin } = getWinPosition(cellIndex);

        if (winPosition.length) {
            let maxCell = Math.max(...winPosition);
            let minCell = Math.min(...winPosition);
            const valueCheck = cellValues[winPosition[0]] === competitor?.type ? me?.type : competitor?.type;

            if (roleIndexWin === 0) {
                if (cellValues[minCell - 1] === valueCheck && cellValues[maxCell + 1] === valueCheck) {
                    return;
                }
            } else
                if (roleIndexWin === 1) {
                    if (cellValues[minCell - GAME_SIZE] === valueCheck && cellValues[maxCell + GAME_SIZE] === valueCheck) {
                        return;
                    }
                } else {
                    if ((cellValues[minCell - (GAME_SIZE - 1)] === valueCheck && cellValues[maxCell + (GAME_SIZE + 1)] === valueCheck) || (cellValues[minCell - (GAME_SIZE + 1)] === valueCheck && cellValues[maxCell + (GAME_SIZE - 1)] === valueCheck)) {
                        return;
                    }
                }
            dispatch(setWinGame({
                winPosition: winPosition,
                winner: cellValues[winPosition[0]] === me?.type ? me : competitor
            }))
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cellValues]);


    useEffect(() => {
        if (winPosition.length === 0 && winner === null) {
            dispatch(setCurrentPlayer(currentPlayer === competitor?.type ? me?.type : competitor?.type))
            return;
        }

        confirmAlertModal({
            title: `${winner?.name} đã chiến thắng.`,
            message: 'Bạn có muốn tiếp tục chơi không?',
            onAccept: () => {
                socket.value.emit('replayGame', { to: competitor, user: me });
            }

        });




        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [winPosition, cellValues])

    const handleOnCellClick = (index: number) => {
        if (cellValues[index]) return;
        const newCellValues = [...cellValues];
        newCellValues[index] = currentPlayer as String || CURRENT_PLAYER.CROSS;

        dispatch(cellClick({
            cellSelect: index,
            cellValues: newCellValues
        }))

    }

    useEffect(() => {
        if (!cellSelect) return;
        checkWin(cellSelect);

    }, [cellSelect, checkWin])

    useEffect(() => {
        if (socket.value) {
            socket.value.on('cellClickToClient', (index: number) => {
                handleOnCellClick(index);
            })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [socket.value, cellValues, currentPlayer])

    return (
        <>
            {cellValues.map((value, index) => (
                <CellComponent isCellSelect={index === cellSelect} isCellWin={winPosition.includes(index)} key={index} value={value} onClick={throttle(() => {
                    if (currentPlayer !== me?.type || gameStatus === GAME_STATUS.NOT_STARTED || gameStatus === GAME_STATUS.END_GAME) return;
                    socket.value.emit('cellClick', { cellIndex: index, to: competitor?.socketId });
                    handleOnCellClick(index);

                }, 1000)} />
            ))}
        </>
    )
}

export default CellsComponent