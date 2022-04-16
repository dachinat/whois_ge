import React from 'react';
import {Spinner} from '@primer/react';
import dayjs from 'dayjs';

export default ({info}) => {
    const renderDetails = () => {
        if (!info.details || !info.details.registrar || info.available) {
            return null;
        }
        return (<div>
            <div style={{marginTop: "5px"}}>Details:</div>
            <div>
                {info.details.registrar.name && <div>Registrar: {info.details.registrar.name}</div>}
                {info.details.created_on && <div>Created on: {dayjs(info.details.created_on).format("DD/MMMM/YYYY")}</div>}
                {info.details.expires_on && <div>Expires on: {dayjs(info.details.expires_on).format("DD/MMMM/YYYY")}</div>}

                {info.details.registrant_contacts.map((registrant_contact, i) => {
                    return (
                        <React.Fragment key={i}>
                            {registrant_contact.name && <div>Registrant name: {registrant_contact.name}</div>}
                            {registrant_contact.email && <div>Registrant email: {registrant_contact.email}</div>}
                        </React.Fragment>
                    );
                })}

                {info.details.admin_contacts.map((admin_contact, i) => {
                    return (
                        <React.Fragment key={i}>
                            {admin_contact.name && <div>Admin contact name: {admin_contact.name}</div>}
                            {admin_contact.email && <div>Admin contact email: {admin_contact.email}</div>}
                        </React.Fragment>
                    );
                })}

                {info.details.technical_contacts.map((technical_contact, i) => {
                    return (
                        <React.Fragment key={i}>
                            {technical_contact.name && <div>Technical contact name: {technical_contact.name}</div>}
                            {technical_contact.email && <div>Technical contact email: {technical_contact.email}</div>}
                        </React.Fragment>
                    );
                })}

                {info.details.nameservers.length > 0 && <div>Nameservers:
                    {info.details.nameservers.map((ns, i) => {
                        return (
                            <React.Fragment key={i}>
                                {ns.name && <div>{ns.name}</div>}
                            </React.Fragment>
                        );
                    })}
                </div>}
            </div>
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
                <div>Available: {info.available ? <span style={{color: "#7ad687"}}>Yes</span> : "No"}</div>
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