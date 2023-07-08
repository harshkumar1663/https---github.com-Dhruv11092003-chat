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
