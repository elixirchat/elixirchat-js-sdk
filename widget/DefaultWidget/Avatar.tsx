import React, { useState } from 'react';

interface AvatarProps {
  src?: string;
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({ src, className = 'elixirchat-chat-avatar' }) => {
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    setHasError(true);
  };

  if (src && !hasError) {
    return (
      <img 
        className={className} 
        src={src} 
        onError={handleError}
        alt="Avatar"
      />
    );
  }

  return <div className={`${className} elixirchat-chat-avatar__system`} />;
};