export type RatingType = 'POSITIVE' | 'NEGATIVE';

export type RatingLocksByMessageId = Record<string, boolean>;

export type RatingCommentModalState = {
  isOpen: boolean;
  ratingId: string | null;
  messageId: string | null;
  isSubmitted: boolean;
};

export function isMessageRated(message: any): boolean {
  return Boolean(message?.rating && (message.rating.id || message.rating.rating));
}

export function isMessageLocked(
  ratingLocksByMessageId: RatingLocksByMessageId | undefined,
  messageId: string
): boolean {
  return Boolean(ratingLocksByMessageId?.[messageId]);
}

export function lockRating(
  ratingLocksByMessageId: RatingLocksByMessageId | undefined,
  messageId: string
): RatingLocksByMessageId {
  return { ...(ratingLocksByMessageId || {}), [messageId]: true };
}

export function unlockRating(
  ratingLocksByMessageId: RatingLocksByMessageId | undefined,
  messageId: string
): RatingLocksByMessageId {
  return { ...(ratingLocksByMessageId || {}), [messageId]: false };
}

export function openRatingCommentModalState(messageId: string): RatingCommentModalState {
  return {
    isOpen: true,
    ratingId: null,
    messageId,
    isSubmitted: false,
  };
}

export function closeRatingCommentModalState(): RatingCommentModalState {
  return {
    isOpen: false,
    ratingId: null,
    messageId: null,
    isSubmitted: false,
  };
}

export function setRatingCommentModalRatingIdState(
  modal: RatingCommentModalState | undefined,
  messageId: string,
  ratingId: string
): RatingCommentModalState | null {
  if (!modal?.isOpen || modal.messageId !== messageId) {
    return null;
  }
  return { ...modal, ratingId };
}

export function markRatingCommentSubmittedState(
  modal: RatingCommentModalState | undefined
): RatingCommentModalState | null {
  if (!modal?.isOpen) {
    return null;
  }
  return { ...modal, isSubmitted: true };
}

