import Popup from 'reactjs-popup';
import './popup.css';


import React from 'react'

const PopupComponent = ({ children, title, description, onAccept }) => {
    return (
        <Popup
            trigger={children}
            modal
            nested
        >
            {(close) => (
                <div className="modal">
                    <button className="close" onClick={close}>
                        &times;
                    </button>
                    <div className="header"> {title} </div>
                    <div className="content">
                        {description}
                    </div>
                    <div className="actions">
                        <button onClick={() => {
                            onAccept()
                            close();
                        }} className="button ok"> OK </button>
                        <button
                            className="button close"
                            onClick={() => {
                                close();
                            }}
                        >
                            Đóng
                        </button>
                    </div>
                </div>
            )}
        </Popup>
    )
}

export default PopupComponent;