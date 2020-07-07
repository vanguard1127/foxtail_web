import React from 'react';

const UIWrapper: React.FC = ({ children }) => {
    return (
        <section className="meet-filter">
            <div className="container">
                <div className="col-md-12">
                    <div className="row">
                        {children}
                    </div>
                </div>
            </div>
        </section>
    )
}

export default UIWrapper;
