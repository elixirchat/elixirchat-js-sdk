import React, { useEffect, useRef, useState } from 'react';
import { cn } from '../../utilsCommon';
import { Tooltip } from './Tooltip';

interface IRatingButtonProps {
  type: 'POSITIVE' | 'NEGATIVE';
  message: any;
  isLocked?: boolean;
  onRate: (messageId: string, rating: 'POSITIVE' | 'NEGATIVE') => void;
  intl: {
    formatMessage: (arg: { id: string }) => string;
  };
}

export const RatingButton = ({ type, message, isLocked = false, onRate, intl }: IRatingButtonProps) => {
  const isPositive = type === 'POSITIVE';
  const [optimisticRating, setOptimisticRating] = useState<'POSITIVE' | 'NEGATIVE' | null>(null);

  const isRated = Boolean(message?.rating && (message.rating.id || message.rating.rating));
  const effectiveRating = message?.rating?.rating ?? optimisticRating;
  const isActive = effectiveRating === type;
  const prevLockedRef = useRef(isLocked);

  const className = cn({
    'elixirchat-chat-messages__rating-button': true,
    [`elixirchat-chat-messages__rating-button--${isPositive ? 'positive' : 'negative'}`]: true,
    'elixirchat-chat-messages__rating-button--rated': isRated || isLocked
  });

  const icon = isPositive
    ? isActive ? 'icon-like-active' : 'icon-like'
    : isActive ? 'icon-dislike-active' : 'icon-dislike';

  useEffect(() => {
    const prevLocked = prevLockedRef.current;
    prevLockedRef.current = isLocked;

    if (!optimisticRating) {
      return;
    }
    if (isRated) {
      setOptimisticRating(null);
      return;
    }
    if (prevLocked && !isLocked) {
      setOptimisticRating(null);
    }
  }, [isLocked, isRated, optimisticRating]);

  const tooltipTitle = (isRated || isLocked)
    ? intl.formatMessage({ id: 'rate_message_already_rated' })
    : '';

  return (
    <Tooltip title={tooltipTitle} center>
      <button
        className={className}
        onClick={(e) => {
          if (isRated || isLocked) {
            e.preventDefault();
            return;
          }
          // Локальный optimistic: фиксируем активную иконку до WS-апдейта,
          setOptimisticRating(prev => prev ?? type);
          onRate(message.id, type);
        }}
      >
        <i className={icon}/>
      </button>
    </Tooltip>
  );
};
