import React, { useEffect, useRef, useState } from 'react';
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
  const [optimisticRating, setOptimisticRating] = useState<'POSITIVE' | 'NEGATIVE' | null>(null);

  const isRated = !!(message.rating && (message.rating.id || message.rating.rating));
  const effectiveRating = message.rating?.rating ?? optimisticRating;
  const isActive = effectiveRating === type;
  const iconRef = useRef<HTMLElement>(null);

  const className = cn({
    'elixirchat-chat-messages__rating-button': true,
    [`elixirchat-chat-messages__rating-button--${isPositive ? 'positive' : 'negative'}`]: true,
    'elixirchat-chat-messages__rating-button--rated': isRated
  });

  const icon = isPositive
    ? isActive ? 'icon-like-active' : 'icon-like'
    : isActive ? 'icon-dislike-active' : 'icon-dislike';

  // Как только сервер/WS принёс реальный рейтинг — сбрасываем локальный optimistic.
  useEffect(() => {
    if (isRated && optimisticRating) {
      setOptimisticRating(null);
    }
  }, [isRated, optimisticRating]);

  // Тултип нужен только для "уже оценено" (после подтверждения), и не нужен сразу после клика.
  const tooltipTitle = isRated
    ? intl.formatMessage({ id: 'rate_message_already_rated' })
    : '';

  return (
    <Tooltip title={tooltipTitle} center>
      <button
        className={className}
        onClick={(e) => {
          if (isRated) {
            e.preventDefault();
            return;
          }
          // Локальный optimistic: фиксируем активную иконку до WS-апдейта,
          // без хранения состояния наверху.
          if (!optimisticRating) {
            setOptimisticRating(type);
          }
          onRate(message.id, type);
        }}
      >
        <i ref={iconRef} className={icon}/>
      </button>
    </Tooltip>
  );
};
