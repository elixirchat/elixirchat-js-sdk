import type { RatingType, RatingLocksByMessageId, RatingCommentModalState } from './chatMessagesRatingHelpers';
import {
  isMessageLocked,
  isMessageRated,
  lockRating,
  openRatingCommentModalState,
  setRatingCommentModalRatingIdState,
  unlockRating,
  markRatingCommentSubmittedState,
} from './chatMessagesRatingHelpers';

type RatingFlowState = {
  processedMessages: any[];
  ratingLocksByMessageId: RatingLocksByMessageId;
  ratingCommentModal: RatingCommentModalState;
};

type SetStateFn = (updater: any) => void;

export type RatingFlowContext = {
  elixirChatWidget: any;
  getState: () => RatingFlowState;
  setState: SetStateFn;
  closeRatingCommentModal: () => void;
};

export async function rateMessageFlow(
  ctx: RatingFlowContext,
  messageId: string,
  rating: RatingType
) {
  const { elixirChatWidget, getState, setState } = ctx;
  const { processedMessages, ratingLocksByMessageId } = getState();
  const message = processedMessages.find(m => m.id === messageId);

  // Предотвращаем повторную оценку
  if (isMessageLocked(ratingLocksByMessageId, messageId) || isMessageRated(message)) {
    return;
  }

  try {
    // Лочим повторные клики сразу (без изменений messageHistory/processedMessages)
    setState((prevState: RatingFlowState) => ({
      ratingLocksByMessageId: lockRating(prevState.ratingLocksByMessageId, messageId),
    }));

    // Для дизлайка показываем модалку сразу, не дожидаясь ответа API
    // (ratingId проставим после успешного rateMessage)
    if (rating === 'NEGATIVE') {
      setState({ ratingCommentModal: openRatingCommentModalState(messageId) });
    }

    const result = await elixirChatWidget.rateMessage(messageId, rating);

    if (rating === 'NEGATIVE') {
      setState((prevState: RatingFlowState) => {
        const nextModal = setRatingCommentModalRatingIdState(prevState.ratingCommentModal, messageId, result.id);
        if (!nextModal) {
          return null;
        }
        return { ratingCommentModal: nextModal };
      });
    }
  } catch (error) {
    elixirChatWidget.logError('Failed to rate message', error);
    // Если запрос упал — снимаем лок, чтобы можно было повторить попытку.
    setState((prevState: RatingFlowState) => ({
      ratingLocksByMessageId: unlockRating(prevState.ratingLocksByMessageId, messageId),
    }));
  }
}

export async function submitRatingCommentFlow(ctx: RatingFlowContext, comment: string) {
  const { elixirChatWidget, getState, setState, closeRatingCommentModal } = ctx;
  const { ratingCommentModal } = getState();

  if (!ratingCommentModal.ratingId) {
    return;
  }

  try {
    await elixirChatWidget.addRatingComment(ratingCommentModal.ratingId, comment);
    setState((prevState: RatingFlowState) => {
      const nextModal = markRatingCommentSubmittedState(prevState.ratingCommentModal);
      if (!nextModal) {
        return null;
      }
      return { ratingCommentModal: nextModal };
    });
  } catch (error) {
    closeRatingCommentModal();
  }
}

