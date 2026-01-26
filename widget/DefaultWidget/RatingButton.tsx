import React, { useEffect, useRef } from 'react';
import { cn } from '../../utilsCommon';
import { Tooltip } from './Tooltip';

interface IRatingButtonProps {
  type: 'POSITIVE' | 'NEGATIVE';
  message: any;
  onRate: (messageId: string, rating: 'POSITIVE' | 'NEGATIVE') => void;
  intl: {
    formatMessage: (arg: { id: string }) => string;
  };
}

export const RatingButton = ({ type, message, onRate, intl }: IRatingButtonProps) => {
  const isPositive = type === 'POSITIVE';
  const isRated = !!(message.rating && (message.rating.id || message.rating.rating));
  const isActive = message.rating?.rating === type;
  const iconRef = useRef<HTMLElement>(null);

  const className = cn({
    'elixirchat-chat-messages__rating-button': true,
    [`elixirchat-chat-messages__rating-button--${isPositive ? 'positive' : 'negative'}`]: true,
    'elixirchat-chat-messages__rating-button--rated': isRated
  });

  const icon = isPositive
    ? isActive ? 'icon-like-active' : 'icon-like'
    : isActive ? 'icon-dislike-active' : 'icon-dislike';

  if (isRated) {
    return (
      <Tooltip title={intl.formatMessage({ id: 'rate_message_already_rated' })} center>
        <button className={className} onClick={(e) => e.preventDefault()}>
          <i ref={iconRef} className={icon}/>
        </button>
      </Tooltip>
    );
  }

  return (
    <button
      className={className}
      onClick={() => onRate(message.id, type)}
      title={intl.formatMessage({ id: isPositive ? 'rate_positive' : 'rate_negative' })}
    >
      <i ref={iconRef} className={icon}/>
    </button>
  );
};
