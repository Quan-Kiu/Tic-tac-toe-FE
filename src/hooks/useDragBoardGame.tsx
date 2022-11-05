import React, { useEffect } from 'react'


const useDragBoardGame = (element: React.RefObject<HTMLDivElement>) => {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

    useEffect(() => {
        const removeDefaultEvent = (e: MouseEvent) => {
            e.preventDefault();
        }
        element.current?.parentElement?.addEventListener('contextmenu', removeDefaultEvent, false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
        return () => element.current?.parentElement?.removeEventListener('contextmenu', removeDefaultEvent);

    }, [element])

    function elementDrag(e: MouseEvent) {
        e = e || window.event;
        e.preventDefault();
        e.stopPropagation();
        // calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        if (element.current!.offsetTop - pos2 <= -600
            || element.current!.offsetTop - pos2 >= 600
            || element.current!.offsetLeft - pos1 <= -600 || element.current!.offsetLeft - pos1 >= 1000
        ) return;
        // set the element's new position:
        element.current!.style.top = (element.current!.offsetTop - pos2) + "px";
        element.current!.style.left = (element.current!.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
        // stop moving when mouse button is released:
        document.onmouseup = null;
        document.onmousemove = null;
    }

    function onDrag(e: React.MouseEvent) {
        if (!e || (e.button === 0 && e.buttons === 1)) return;
        e = e || window.event;
        e.preventDefault();
        // get the mouse cursor position at startup:
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag;
    }

    return [onDrag];
}

export default useDragBoardGame