import React from 'react';

function ChatPreview({ name, img_source }) {
  return (
    <div className="chat-preview">
      <img src={img_source} alt="Profile" className="profile-picture" />
      <div className="contact-name">{name}</div>
    </div>
  );
}

export default ChatPreview;
