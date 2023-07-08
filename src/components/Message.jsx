import React from 'react'
import './Message.css'

function Message({ label, cls }) {

    if (cls === "message sender-msg")
        return (
            <div className="message-contianer-sender">
                <div className={cls}>
                    {label}
                </div>
            </div>
        )
    else if(cls === "message receiver-msg")
    return (
        <>
            <div className="message-contianer-receiver">
                <div className={cls}>
                    {label}
                </div>
            </div>
        </>
    )
}

export default Message
