import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { io } from 'socket.io-client';
import { CURRENT_PLAYER, GAME_STATUS } from '../../constant';
import { RootState } from '../../store';
import { logout } from '../../store/authSlice';
import { gameRequest, outGameRoom } from '../../store/gameSlice';
import { setSocket } from '../../store/socketSlice';
import { confirmAlertModal } from '../../utils/confirmAlert';
import Popup from '../Popup';
import CountDown from './CountDown';
import cssModule from './Sidebar.module.scss';

const styles: any = cssModule;


const Sidebar = () => {
    const { auth, socket } = useSelector((state: RootState) => state);
    const { competitor, me, gameStatus, currentPlayer, winStats } = useSelector((state: RootState) => state.game);
    const dispatch = useDispatch();
    useEffect(() => {
        if (auth.id) {
            const socket = io("http://192.168.1.9:5000");
            dispatch(setSocket(socket));
            return () => {
                socket.close();
            };
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [auth])

    const meWin = useMemo(() => winStats.filter((v) => v === me?.type).length, [winStats, me?.type]);
    const competitorWin = useMemo(() => winStats.filter((v) => v === competitor?.type).length, [winStats, competitor?.type]);

    const handleOnRequestGame = (u: { id: string, socketId: string, name: string }) => {

        const payload = {
            competitor: {
                ...u,
                type: CURRENT_PLAYER.CIRCLE
            },
            me: {
                ...auth,
                socketId: socket.value.id,
                type: CURRENT_PLAYER.CROSS
            }

        }
        socket.value.emit('gameRequest', payload);
        dispatch(gameRequest(payload));
    }


    return (
        <div className={styles.sideBar}>
            <div className={styles.introduce}>
                <div>
                    Hello <span>{auth.name}</span>
                </div>
                <i onClick={() => {
                    if (gameStatus === GAME_STATUS.STARTED || gameStatus === GAME_STATUS.END_GAME) {
                        confirmAlertModal({
                            title: 'Bạn có muốn thoát trận đấu?',
                            message: `Thoát trận đấu giữa trừng đồng nghĩa với việc bạn sẽ bị xử thua. Bạn có chắc không?`,
                            onAccept: () => {
                                dispatch(outGameRoom({}));

                            }

                        });
                    } else {
                        dispatch(logout({}));

                    }
                }} className="fa-solid fa-right-from-bracket"></i>
            </div>
            <div className={styles.playTogether}>

                {gameStatus === GAME_STATUS.NOT_STARTED && <><div className={styles.title}>PLAY TOGETHER</div>
                    {
                        socket.player.map((u, index) => (
                            <div key={index} className={styles.player}>
                                <div>
                                    <span></span> {u.name}
                                </div>
                                <Popup title={<b>Yêu cầu chơi game</b>} description={
                                    <div style={{ fontSize: 14 }}>
                                        <b style={{ fontSize: 15 }}>Hướng dẫn trò chơi:</b><br />
                                        <p>- Khi người chơi chấp nhận yêu cầu chơi game và bắt đầu trò chơi bạn sẽ là lượt đi đầu tiên và cầm cờ <b style={{
                                            color: '#FFEBA1'
                                        }}>X</b>. Đối thủ của bạn sẽ cầm cờ <b style={{
                                            color: 'red'
                                        }}>O</b></p>
                                        <p>- Nhiệm vụ của mỗi người chơi cờ caro đó là đạt được một <b><i>đường thẳng</i></b>, <b><i>đường chéo</i></b>, <b><i>đường ngang</i></b> với <b><i>5 ô nhanh nhất</i></b>. Tuy nhiên, người chơi phải đạt 5 nước không bị đối thủ <b><i>chặn hai đầu</i></b> thì mới có thể chiến thắng.</p>
                                        <br />
                                        <b style={{ fontSize: 15 }}>Hướng dẫn thao tác trò chơi:</b><br />
                                        <p>- Click <b>chuột trái</b> để chọn vị trí cờ</p>
                                        <p>- Click và giữ <b>chuột phải</b> để thay đổi vị trí bàn cờ.</p>
                                        <br />
                                        <div style={{ color: 'red', textAlign: 'center' }}> <i >YÊU CẦU CHƠI GAME SẼ ĐƯỢC GỬI ĐẾN <b>{u.name.toUpperCase()}</b> KHI BẠN NHẤN NÚT OK BÊN DƯỚI</i></div>
                                    </div>
                                } onAccept={() => {
                                    handleOnRequestGame(u)
                                }}>

                                    <i className="fa-solid fa-play"></i>
                                </Popup>
                            </div>

                        ))
                    }</>}
                {gameStatus !== GAME_STATUS.NOT_STARTED && <div className={styles.solo}>
                    <div className={styles.playerInfo}>
                        <div className={styles.name}>
                            {me?.name} ( <span style={{
                                color: me?.type === CURRENT_PLAYER.CIRCLE ? 'red' : '#FDAF75'
                            }}>{me?.type}</span> )
                        </div>
                        <div className={styles.stats}>{meWin}</div>


                    </div>
                    <div className={styles.currentTurn}>
                        <div>
                            Lượt đi của <span style={{
                                color: currentPlayer === CURRENT_PLAYER.CIRCLE ? 'red' : '#FDAF75'
                            }}>{currentPlayer}</span>
                        </div>
                        <div className={styles.timer}>
                            <CountDown />
                        </div>

                    </div>
                    <div className={styles.playerInfo}>
                        <div className={styles.stats}>{competitorWin}</div>
                        <div className={styles.name}>
                            {competitor?.name} ( <span style={{
                                color: competitor?.type === CURRENT_PLAYER.CIRCLE ? 'red' : '#FDAF75'
                            }}>{competitor?.type}</span> )
                        </div>


                    </div>
                </div>}


            </div>
        </div>
    )
}

export default Sidebar