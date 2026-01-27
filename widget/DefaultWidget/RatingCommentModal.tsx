import React, { Component } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { cn } from '../../utilsCommon';

interface IRatingCommentModalProps {
  intl: any;
  onSubmit: (comment: string) => void;
  onSkip: () => void;
  elixirChatWidget?: any;
  isSubmitted?: boolean;
  isReady?: boolean;
}

interface IRatingCommentModalState {
  comment: string;
  isSubmitting: boolean;
  showThankYou: boolean;
}

class RatingCommentModalComponent extends Component<IRatingCommentModalProps, IRatingCommentModalState> {
  private hideAnimationTimeout: ReturnType<typeof setTimeout> | null = null;
  private thankYouTimeout: ReturnType<typeof setTimeout> | null = null;

  constructor(props: IRatingCommentModalProps) {
    super(props);
    this.state = { 
      comment: '',
      isSubmitting: false,
      showThankYou: false,
    };
  }

  componentDidUpdate(prevProps: IRatingCommentModalProps) {
    if (!prevProps.isSubmitted && this.props.isSubmitted) {
      this.startThankYouFlow();
    }
  }

  componentWillUnmount() {
    if (this.hideAnimationTimeout) {
      clearTimeout(this.hideAnimationTimeout);
    }
    if (this.thankYouTimeout) {
      clearTimeout(this.thankYouTimeout);
    }
  }

  startThankYouFlow = () => {
    this.setState({ showThankYou: true });
    
    this.thankYouTimeout = setTimeout(() => {
      this.props.onSkip();
    }, 1500);
  };

  handleSubmit = () => {
    const comment = this.state.comment.trim();
    
    if (!this.props.isReady || !comment || this.state.isSubmitting) {
      return;
    }

    this.setState({ isSubmitting: true });
    this.props.onSubmit(comment);
  };

  render() {
    const { onSkip, elixirChatWidget, isReady = true } = this.props;
    const { comment, isSubmitting, showThankYou } = this.state;
    const modalDislikeIcon = elixirChatWidget?.widgetAssets?.assets?.svg?.modalDislikeIcon;
    const modalHeartIcon = elixirChatWidget?.widgetAssets?.assets?.svg?.modalHeartIcon;
    
    return (
      <div className="elixirchat-rating-comment-modal">
        <div 
          className="elixirchat-rating-comment-modal__overlay" 
          onClick={isSubmitting ? () => {} : onSkip} 
        />
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
                maxLength={1000}
              />
              <div className="elixirchat-rating-comment-modal__actions">
                <button
                  className="elixirchat-rating-comment-modal__button"
                  onClick={this.handleSubmit}
                  disabled={!isReady || !comment.trim() || isSubmitting}>
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
