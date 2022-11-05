import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { GAME_STATUS } from '../../constant';
import { RootState } from '../../store';
import { setWinGame } from '../../store/gameSlice';

const TIMER = 30;

const CountDown = () => {
    const [currentTime, setCurrentTime] = useState(TIMER);
    const { gameStatus, competitor, currentPlayer, me } = useSelector((state: RootState) => state.game);
    const dispatch = useDispatch();


    useEffect(() => {
        if (gameStatus === GAME_STATUS.STARTED && currentTime > 0) {
            var timerRef = setInterval(() => {
                if (currentTime > 0) {
                    setCurrentTime((pre) => --pre);
                }
            }, 1000)

        }

        return () => {
            clearInterval(timerRef)
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [gameStatus, currentTime])



    useEffect(() => {
        if (currentTime <= 0 && gameStatus === GAME_STATUS.STARTED) {
            dispatch(setWinGame({
                winPosition: [],
                winner: currentPlayer === me?.type ? competitor : me
            }))
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentTime])

    useEffect(() => {
        setCurrentTime(TIMER);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPlayer])


    return (
        <div>{currentTime + 's'}</div>
    )
}

export default CountDown