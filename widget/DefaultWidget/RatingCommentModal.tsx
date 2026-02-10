import React, { Component } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { cn } from '../../utilsCommon';
import { Player } from '@lottiefiles/react-lottie-player';
import animationData from './assets/lottie-dislike-animation.json';

interface IRatingCommentModalProps {
  onSubmit: (comment: string) => void;
  onSkip: () => void;
  isSubmitted?: boolean;
  isReady?: boolean;
}

interface IRatingCommentModalState {
  comment: string;
  isSubmitting: boolean;
  mode: 'default' | 'success';
  isClosing: boolean;
  lottiePlayId: number;
  contentAppear: boolean;
}

class RatingCommentModalComponent extends Component<IRatingCommentModalProps, IRatingCommentModalState> {
  private closeStartTimeout: ReturnType<typeof setTimeout> | null = null;
  private closeFinishTimeout: ReturnType<typeof setTimeout> | null = null;
  private textareaRef = React.createRef<HTMLTextAreaElement>();

  constructor(props: IRatingCommentModalProps) {
    super(props);
    this.state = { 
      comment: '',
      isSubmitting: false,
      mode: 'default',
      isClosing: false,
      lottiePlayId: 0,
      contentAppear: true,
    };
  }

  componentDidMount() {
    this.textareaRef.current?.focus();
  }

  componentDidUpdate(prevProps: IRatingCommentModalProps) {
    if (!prevProps.isSubmitted && this.props.isSubmitted) {
      this.startSuccessFlow();
    }
  }

  componentWillUnmount() {
    this.clearCloseTimeouts();
  }

  onContentAnimationEnd = (e: React.AnimationEvent<HTMLDivElement>) => {
    if (e.animationName === 'modalAppear' && this.state.contentAppear) {
      this.setState({ contentAppear: false });
    }
  };

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

    this.closeStartTimeout = setTimeout(() => {
        this.setState({ isClosing: true });
    }, 1500);

    this.closeFinishTimeout = setTimeout(() => {
        this.props.onSkip();
    }, 2000);
  };

  handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    this.setState({ comment: e.target.value });
  };

  handleSkip = () => {
    const { onSkip } = this.props;

    this.clearCloseTimeouts();

    this.setState({ isClosing: true });

    this.closeFinishTimeout = setTimeout(() => {
      onSkip();
    }, 500);
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
    const { onSkip, isReady = true } = this.props;
    const { comment, isSubmitting, mode, isClosing, lottiePlayId, contentAppear } = this.state;
    const isSuccess = mode === 'success';
    const lottieKey = isSuccess ? `success-${lottiePlayId}` : 'default';
    
    return (
      <div className={cn({
        'elixirchat-rating-comment-modal': true,
        'elixirchat-rating-comment-modal--closing': isClosing,
      })}>
        <div 
          className="elixirchat-rating-comment-modal__overlay" 
        />
        <div
          className={cn({
            'elixirchat-rating-comment-modal__content': true,
            'elixirchat-rating-comment-modal__content--appear': contentAppear,
            'elixirchat-rating-comment-modal__content--hiding': isClosing,
            'elixirchat-rating-comment-modal__content--success': isSuccess,
          })}
          onAnimationEnd={this.onContentAnimationEnd}
        >
          <div className="elixirchat-rating-comment-modal__animation">
            <Player
              key={lottieKey}
              src={animationData as any}
              autoplay={isSuccess}
              loop={false}
              style={{ height: '112px', width: '112px' }}
            />
          </div>

          <div className="elixirchat-rating-comment-modal__default-form">
            <h3 className="elixirchat-rating-comment-modal__title elixirchat-rating-comment-modal__title--default">
              <FormattedMessage id="rate_message_comment_title" />
            </h3>

            <div className="elixirchat-rating-comment-modal__body">
              <textarea
                className="elixirchat-rating-comment-modal__textarea"
                ref={this.textareaRef}
                value={comment}
                onChange={this.handleChange}
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
                  onClick={this.handleSkip}
                  disabled={isSubmitting || isSuccess}>
                  <FormattedMessage id="rate_message_comment_skip" />
                </button>
              </div>
            </div>
          </div>

          <h3 className="elixirchat-rating-comment-modal__title elixirchat-rating-comment-modal__title--success">
            <FormattedMessage
              id="rate_message_thank_you"
              values={{
                br: () => <br />
              }}
            />
          </h3>
        </div>
      </div>
    );
  }
}

export const RatingCommentModal = injectIntl(RatingCommentModalComponent);
