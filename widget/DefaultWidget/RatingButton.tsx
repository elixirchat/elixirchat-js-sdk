import React, { useEffect, useRef, useState } from 'react';
import { cn } from '../../utilsCommon';
import { Tooltip } from './Tooltip';

interface IRatingButtonProps {
  type: 'POSITIVE' | 'NEGATIVE';
  messageId: string;
  rating?: 'POSITIVE' | 'NEGATIVE' | null;
  isLocked?: boolean;
  onRate: (messageId: string, rating: 'POSITIVE' | 'NEGATIVE') => void;
  intl: {
    formatMessage: (arg: { id: string }) => string;
  };
}

export const RatingButton = ({ type, messageId, rating, isLocked = false, onRate, intl }: IRatingButtonProps) => {
  const isPositive = type === 'POSITIVE';
  const [optimisticRating, setOptimisticRating] = useState<'POSITIVE' | 'NEGATIVE' | null>(null);
  const [shouldAnimate, setShouldAnimate] = useState(false);
  
  const isRated = Boolean(rating);
  const effectiveRating = rating ?? optimisticRating;
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
  
  const iconClassName = cn({
    [icon]: true,
    'elixirchat-chat-messages__rating-button--animate': shouldAnimate && isActive && isPositive
  });

  useEffect(() => {
    const prevLocked = prevLockedRef.current;
    prevLockedRef.current = isLocked;

    if (isActive && optimisticRating === type && !isRated && isPositive) {
        setShouldAnimate(true);
    }

    if (optimisticRating && (isRated || (prevLocked && !isLocked))) {
      setOptimisticRating(null);
      setShouldAnimate(false);
    }
  }, [isActive, optimisticRating, type, isRated, isLocked, isPositive]);

  useEffect(() => {
    if (shouldAnimate) {
      const timer = setTimeout(() => {
        setShouldAnimate(false);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [shouldAnimate]);

  const tooltipTitle = (isRated || isLocked)
    ? intl.formatMessage({ id: 'rate_message_already_rated' })
    : '';

  return (
    <Tooltip title={tooltipTitle} center trigger="click">
      <button
        className={className}
        onClick={(e) => {
          if (isRated || isLocked) {
            e.preventDefault();
            return;
          }
          setOptimisticRating(type);
          onRate(messageId, type);
        }}
      >
        <i className={iconClassName}/>
      </button>
    </Tooltip>
  );
};
