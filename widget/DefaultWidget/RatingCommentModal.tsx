import React, { Component } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { cn } from '../../utilsCommon';

interface IRatingCommentModalProps {
  intl: any;
  onSubmit: (comment: string) => void;
  onSkip: () => void;
  elixirChatWidget?: any;
}

interface IRatingCommentModalState {
  comment: string;
  isSubmitting: boolean;
  showThankYou: boolean;
}

class RatingCommentModalComponent extends Component<IRatingCommentModalProps, IRatingCommentModalState> {
  private thankYouTimeout: number | null = null;

  constructor(props) {
    super(props);
    this.state = { 
      comment: '',
      isSubmitting: false,
      showThankYou: false,
    };
  }

  componentWillUnmount() {
    if (this.thankYouTimeout) {
      clearTimeout(this.thankYouTimeout);
    }
  }

  handleSubmit = async () => {
    const { comment } = this.state;
    if (comment.trim()) {
      this.setState({ isSubmitting: true });
      
      // Запускаем анимацию скрытия формы
      setTimeout(() => {
        this.setState({ showThankYou: true });
        
        // Через 1500ms скрываем модальное окно
        this.thankYouTimeout = setTimeout(() => {
          this.props.onSubmit(comment);
        }, 1500);
      }, 300); // Небольшая задержка для анимации скрытия
    } else {
      this.props.onSkip();
    }
  };

  render() {
    const { intl, onSkip, elixirChatWidget } = this.props;
    const { comment, isSubmitting, showThankYou } = this.state;
    const modalDislikeIcon = elixirChatWidget?.widgetAssets?.assets?.svg?.modalDislikeIcon;
    const modalHeartIcon = elixirChatWidget?.widgetAssets?.assets?.svg?.modalHeartIcon;
    
    return (
      <div className="elixirchat-rating-comment-modal">
        <div className="elixirchat-rating-comment-modal__overlay" onClick={onSkip} />
        <div className={cn({
          'elixirchat-rating-comment-modal__content': true,
          'elixirchat-rating-comment-modal__content--hiding': isSubmitting && !showThankYou,
          'elixirchat-rating-comment-modal__content--thank-you': showThankYou,
        })}>
          {!showThankYou ? (
            <>
              {modalDislikeIcon && (
                <img 
                  src={modalDislikeIcon} 
                  alt=""
                  className="elixirchat-rating-comment-modal__icon"
                />
              )}
              <h3 className="elixirchat-rating-comment-modal__title">
                <FormattedMessage id="rate_message_comment_title" />
              </h3>
              <textarea
                className="elixirchat-rating-comment-modal__textarea"
                value={comment}
                onChange={(e) => this.setState({ comment: e.target.value })}
                rows={4}
                disabled={isSubmitting}
              />
              <div className="elixirchat-rating-comment-modal__actions">
                <button
                  className="elixirchat-rating-comment-modal__button"
                  onClick={this.handleSubmit}
                  disabled={!comment.trim()}>
                  <FormattedMessage id="rate_message_comment_submit" />
                </button>
                <button
                  className="elixirchat-rating-comment-modal__button elixirchat-rating-comment-modal__button--skip"
                  onClick={onSkip}
                  disabled={isSubmitting}>
                  <FormattedMessage id="rate_message_comment_skip" />
                </button>
              </div>
            </>
          ) : (
            <div className="elixirchat-rating-comment-modal__thank-you">
              {modalHeartIcon && (
                <img 
                  src={modalHeartIcon} 
                  alt=""
                  className="elixirchat-rating-comment-modal__icon elixirchat-rating-comment-modal__icon--heart"
                />
              )}
              <FormattedMessage id="rate_message_thank_you" />
            </div>
          )}
        </div>
      </div>
    );
  }
}

export const RatingCommentModal = injectIntl(RatingCommentModalComponent);
