import { useRef } from 'react';
import CellsComponent from '../../components/Cells';
import Sidebar from '../../components/Sidebar';
import { BOARD_WIDTH, GAME_SIZE } from '../../constant';
import useDragBoardGame from '../../hooks/useDragBoardGame';
import cssModule from './HomePage.module.scss';

interface HomePageProp {

}

const styles: any = cssModule;
const HomePage = (props: HomePageProp) => {
    const boardRef = useRef<HTMLDivElement>(null);
    const [onMoveGameBoard] = useDragBoardGame(boardRef);


    return (
        <div className={styles.container}>
            <Sidebar />

            <div className={styles.gameBoard} style={{
                "--GAME_SIZE": GAME_SIZE,
                "--BOARD_WIDTH": BOARD_WIDTH,
            } as React.CSSProperties}>
                <div onMouseDown={onMoveGameBoard} ref={boardRef} className={styles.board}>

                    <CellsComponent />
                </div>
            </div>
        </div >
    )
}

export default HomePage