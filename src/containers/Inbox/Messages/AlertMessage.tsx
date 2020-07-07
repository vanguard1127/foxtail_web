import React from 'react';

interface IAlertMessageProps {
    text: string;
}

const AlertMessage: React.FC<IAlertMessageProps> = ({ text }) => {
    return (
        <div
            style={{
                margin: "0 -20px 0 -20px",
                background: "#ffffff70",
                padding: "20px 0",
                textAlign: "center"
            }}
        >
            {text}
        </div>
    )
}

export default AlertMessage;
