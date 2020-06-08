import React from 'react';

interface IClickForMoreBtnProps {
    onClick: () => void;
    isLoading: boolean;
}

const ClickForMoreBtn: React.FC<IClickForMoreBtnProps> = ({
    onClick,
    isLoading,
}) => {
    return (
        <div
            style={{
                textAlign: "center",
                textDecoration: "underline",
                color: "blue",
                cursor: "pointer",
                padding: "10px"
            }}
            onClick={onClick}
        >
            {isLoading ? "Loading..." : "Click for more"}
        </div>
    )
}

export default ClickForMoreBtn;
