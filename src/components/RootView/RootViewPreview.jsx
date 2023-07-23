import React from 'react'
import './RootViewPreview.css'

function RootViewPreview({id , username , isBlocked , profilePic , handleToggleBlockedStatus}) {
    // let  isBlocked = true;
    return (
        <>
            <div key={id} className="user-row">
                <div className="name-image-request">
                    <div className="user-search-image-container">
                        <img
                            className='user-search-image'
                            src={`http://localhost:4000/api/profile-pictures/${encodeURIComponent(profilePic)}`}
                            alt={username}
                        />
                    </div>
                    <div className="user-request-username">
                        {username}
                    </div>
                </div>

                <span className='root-checkbox'>
                    Blocked:{' '}
                    <input
                    className='checkbox'
                        type="checkbox"
                        checked={isBlocked}
                    onChange={() => handleToggleBlockedStatus(id)}
                    />
                </span>
            </div>
        </>
    )
}

export default RootViewPreview