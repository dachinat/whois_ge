import React from 'react';
import {Spinner} from '@primer/components';


export default ({info}) => {
    const renderDetails = () => {
        if (!info.details || info.available) {
            return null;
        }
        return (<div>
            <div>Details:</div>
            <div dangerouslySetInnerHTML={{__html: info.details}} />
        </div>)
    }

    const renderInfo = () => {
        if (typeof info === 'undefined') {
            return "For information please search and select a domain";
        } else if (!info) {
            return (
                <div>
                    <div>
                        <Spinner size="large" />
                    </div>
                    <div>Loading</div>
                </div>
            );
        }

        return (
            <div>
                <div>Domain: {info.domain}</div>
                <div>Available: {info.available ? "Yes" : "No"}</div>
                <div>{renderDetails()}</div>
            </div>
        );
    };

    return (
        <div>
            {renderInfo()}
        </div>
    );
};