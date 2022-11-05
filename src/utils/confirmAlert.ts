import { confirmAlert } from "react-confirm-alert";

export const confirmAlertModal = ({ title, message, onAccept }: {
    title: string,
    message: string,
    onAccept: () => void
}) => confirmAlert({
    title,
    overlayClassName: "confirm-alert-modal",
    message,
    buttons: [
        {
            label: 'Có',
            onClick: onAccept
        },
        {
            label: 'Không',
        }
    ]
});