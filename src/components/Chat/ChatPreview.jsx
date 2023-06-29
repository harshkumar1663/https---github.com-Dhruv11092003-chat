import React from 'react'
import './ChatPreview.css'
function ChatPreview({name , img_source}) {
    return (
        <>
            <div className="preview-container">
                <div className="profile-picture">
                    <img src={img_source} alt="" />
                </div>
                <h4 className='chat_preview_name'>{name}</h4>
            </div>
        </>
    )
}

export default ChatPreview
