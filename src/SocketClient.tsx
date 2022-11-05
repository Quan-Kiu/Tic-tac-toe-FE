import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CURRENT_PLAYER, GAME_STATUS } from './constant';
import { RootState } from './store';
import { AuthState } from './store/authSlice';
import { acceptGamePlay, changeGameStatus, GameState, replaceGame } from './store/gameSlice';
import { setPlayer, SocketInterface } from './store/socketSlice';
import { confirmAlertModal } from './utils/confirmAlert';

const SocketClient = ({ children }: { children: React.ReactNode }) => {
    const dispatch = useDispatch();
    const { socket, auth, game }: {
        auth: AuthState, socket: SocketInterface, game: GameState
    } = useSelector((state: RootState) => state);

    useEffect(() => {
        if (socket.value) {

            socket.value.emit('join', { id: auth.id, name: auth.name });

            socket.value.on('joinToClient', (users: ({ socketId: string, name: string, id: string })[]) => {
                const newUsers = users.filter((u) => u.id !== auth.id);
                dispatch(setPlayer(newUsers));
            });

            socket.value.on('acceptGameToClient', () => {
                dispatch(changeGameStatus(GAME_STATUS.STARTED));
            })

            socket.value.on('gameRequestToClient', (user: { socketId: string, name: string, id: string, type: string }) => {

                confirmAlertModal({
                    title: 'Yêu cầu chơi game',
                    message: `${user.name} muốn chơi game với bạn. Bạn có muốn tham gia không?`,
                    onAccept: () => {
                        const payload = {
                            competitor: user,
                            me: {
                                ...auth,
                                socketId: socket.value.id,
                                type: CURRENT_PLAYER.CIRCLE,
                            }
                        }
                        dispatch(acceptGamePlay(payload))
                        socket.value.emit('acceptGame', payload.competitor);
                    }

                });


            });
            socket.value.on('acceptGameReplayToClient', () => {
                dispatch(replaceGame({}));
            })

            socket.value.on('gameReplayToClient', (user: { socketId: string, name: string, id: string, type: string }) => {
                confirmAlertModal({
                    title: `${user.name} muốn mời bạn chơi ván mới.`,
                    message: 'Bạn có muốn tiếp tục chơi không?',
                    onAccept: () => {
                        dispatch(replaceGame({}))
                        socket.value.emit('acceptReplayGame', user);
                    }

                });


            });
        }

    }, [auth, auth.id, auth.name, dispatch, socket.value])

    return (
        <>{children}</ >
    )
}

export default SocketClient