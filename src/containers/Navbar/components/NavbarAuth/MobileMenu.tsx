import React from 'react';

interface IMobileMenuProps {
    mobileMenu: boolean;
    onClick: () => void;
    showCount: boolean;
    messageCount: number;
}

const MobileMenu: React.FC<IMobileMenuProps> = ({ mobileMenu, onClick, showCount, messageCount }) => {
    return (
        <div className="mobile-menu">
            <div className={mobileMenu ? "hamburger hamburger--spring is-active" : "hamburger hamburger--spring"}>
                <span className="hamburger-box" onClick={onClick}>
                    <span className="hamburger-inner" />
                    {showCount && <span className="count">{messageCount}</span>}
                </span>
            </div>
        </div>
    )
}

export default MobileMenu;
