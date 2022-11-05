import { CURRENT_PLAYER } from '../../constant';
import cssModule from './Cell.module.scss';

interface IProps {
    onClick: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void,
    value: String,
    isCellWin: boolean,
    isCellSelect: boolean,
}

const styles: any = cssModule;
const CellComponent = ({ onClick, value, isCellWin, isCellSelect }: IProps) => {

    const cellValueClass = value.trim() && (value === CURRENT_PLAYER.CIRCLE ? styles.circle : styles.cross);

    return (
        <div className={`${styles.cell} ${cellValueClass} ${(isCellWin || isCellSelect) && styles.win}`} onClick={onClick}></div>
    )
}

export default CellComponent