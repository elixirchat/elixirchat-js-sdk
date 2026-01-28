import { Component } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { cn } from '../../utilsCommon';
import { Player } from '@lottiefiles/react-lottie-player';
import animationData from './assets/lottie-dislike-animation.json';

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
  mode: 'default' | 'success';
  isClosing: boolean;
  lottiePlayId: number;
}

class RatingCommentModalComponent extends Component<IRatingCommentModalProps, IRatingCommentModalState> {
  private closeStartTimeout: ReturnType<typeof setTimeout> | null = null;
  private closeFinishTimeout: ReturnType<typeof setTimeout> | null = null;

  constructor(props: IRatingCommentModalProps) {
    super(props);
    this.state = { 
      comment: '',
      isSubmitting: false,
      mode: 'default',
      isClosing: false,
      lottiePlayId: 0,
    };
  }

  componentDidUpdate(prevProps: IRatingCommentModalProps) {
    if (!prevProps.isSubmitted && this.props.isSubmitted) {
      this.startSuccessFlow();
    }
  }

  componentWillUnmount() {
    this.clearCloseTimeouts();
  }

  clearCloseTimeouts = () => {
    if (this.closeStartTimeout) {
      clearTimeout(this.closeStartTimeout);
      this.closeStartTimeout = null;
    }
    if (this.closeFinishTimeout) {
      clearTimeout(this.closeFinishTimeout);
      this.closeFinishTimeout = null;
    }
  };

  startSuccessFlow = () => {
    this.clearCloseTimeouts();

    this.setState(prevState => ({
      mode: 'success',
      isSubmitting: false,
      isClosing: false,
      lottiePlayId: prevState.lottiePlayId + 1,
    }));

    // // Автозакрытие: через 1s начинаем fade-out, через 1.3s закрываем.
    // this.closeStartTimeout = setTimeout(() => {
    //   this.setState({ isClosing: true });
    // }, 1000);

    // this.closeFinishTimeout = setTimeout(() => {
    //   this.props.onSkip();
    // }, 1300);
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
    const { comment, isSubmitting, mode, isClosing, lottiePlayId } = this.state;
    const isSuccess = mode === 'success';
    const lottieKey = isSuccess ? `success-${lottiePlayId}` : 'default';
    
    return (
      <div className="elixirchat-rating-comment-modal">
        <div 
          className="elixirchat-rating-comment-modal__overlay" 
          onClick={isSubmitting || isSuccess || isClosing ? () => {} : onSkip} 
        />
        <div className={cn({
          'elixirchat-rating-comment-modal__content': true,
          'elixirchat-rating-comment-modal__content--hiding': isClosing,
          'elixirchat-rating-comment-modal__content--success': isSuccess,
        })}>
          <div className="elixirchat-rating-comment-modal__animation" aria-hidden="true">
            <Player
              key={lottieKey}
              src={animationData as any}
              autoplay={isSuccess}
              loop={false}
              style={{ height: '112px', width: '112px' }}
            />
          </div>

          <div
            className='elixirchat-rating-comment-modal__default-form'
          >
          <h3
            className="elixirchat-rating-comment-modal__title elixirchat-rating-comment-modal__title--default"
          >
            <FormattedMessage id="rate_message_comment_title" />
          </h3>

          <div className="elixirchat-rating-comment-modal__body">
              <textarea
                className="elixirchat-rating-comment-modal__textarea"
                value={comment}
                onChange={(e) => this.setState({ comment: e.target.value })}
                rows={3}
                disabled={isSubmitting}
                maxLength={1000}
              />
            <div className="elixirchat-rating-comment-modal__actions">
              <button
                className="elixirchat-rating-comment-modal__button"
                onClick={this.handleSubmit}
                disabled={isSuccess || !isReady || !comment.trim() || isSubmitting}>
                <FormattedMessage id="rate_message_comment_submit" />
              </button>
              <button
                className="elixirchat-rating-comment-modal__button elixirchat-rating-comment-modal__button--skip"
                onClick={onSkip}
                disabled={isSubmitting || isSuccess}>
                <FormattedMessage id="rate_message_comment_skip" />
              </button>
            </div>
          </div>
          </div>
            <h3
            className="elixirchat-rating-comment-modal__title elixirchat-rating-comment-modal__title--success"
          >
             <FormattedMessage id="rate_message_thank_you" values={{
                br: () => <br />
              }} />
          </h3>
        </div>
      </div>
    );
  }
}

export const RatingCommentModal = injectIntl(RatingCommentModalComponent);
