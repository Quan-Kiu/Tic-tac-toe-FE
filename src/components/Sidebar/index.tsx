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
                            title: 'B???n c?? mu???n tho??t tr???n ?????u?',
                            message: `Tho??t tr???n ?????u gi???a tr???ng ?????ng ngh??a v???i vi???c b???n s??? b??? x??? thua. B???n c?? ch???c kh??ng?`,
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
                                <Popup title={<b>Y??u c???u ch??i game</b>} description={
                                    <div style={{ fontSize: 14 }}>
                                        <b style={{ fontSize: 15 }}>H?????ng d???n tr?? ch??i:</b><br />
                                        <p>- Khi ng?????i ch??i ch???p nh???n y??u c???u ch??i game v?? b???t ?????u tr?? ch??i b???n s??? l?? l?????t ??i ?????u ti??n v?? c???m c??? <b style={{
                                            color: '#FFEBA1'
                                        }}>X</b>. ?????i th??? c???a b???n s??? c???m c??? <b style={{
                                            color: 'red'
                                        }}>O</b></p>
                                        <p>- Nhi???m v??? c???a m???i ng?????i ch??i c??? caro ???? l?? ?????t ???????c m???t <b><i>???????ng th???ng</i></b>, <b><i>???????ng ch??o</i></b>, <b><i>???????ng ngang</i></b> v???i <b><i>5 ?? nhanh nh???t</i></b>. Tuy nhi??n, ng?????i ch??i ph???i ?????t 5 n?????c kh??ng b??? ?????i th??? <b><i>ch???n hai ?????u</i></b> th?? m???i c?? th??? chi???n th???ng.</p>
                                        <br />
                                        <b style={{ fontSize: 15 }}>H?????ng d???n thao t??c tr?? ch??i:</b><br />
                                        <p>- Click <b>chu???t tr??i</b> ????? ch???n v??? tr?? c???</p>
                                        <p>- Click v?? gi??? <b>chu???t ph???i</b> ????? thay ?????i v??? tr?? b??n c???.</p>
                                        <br />
                                        <div style={{ color: 'red', textAlign: 'center' }}> <i >Y??U C???U CH??I GAME S??? ???????C G???I ?????N <b>{u.name.toUpperCase()}</b> KHI B???N NH???N N??T OK B??N D?????I</i></div>
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
                            L?????t ??i c???a <span style={{
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