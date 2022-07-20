import React, {Component} from 'react';
import {injectIntl} from 'react-intl';
import debounce from 'lodash/debounce';
import {cn} from '../../utilsCommon';
import {WIDGET_SEARCH_TOGGLE} from "../ElixirChatWidgetEventTypes";

interface SearchProps {
  onChangeText: (text?: string) => {};
  onScroll: (text?: string) => {};
  className?: string;
  elixirChatWidget: any;
  messages: Array<any>,
  // id сообщений, которые нашли
  searchMessagesIds: Array<string>,
  // id сообщений
  messagesIds: Array<string>,
  searchMessagesCursors: object,
}

interface SearchState {
  searchText: string;
  searchMessagesIds: Array<any>;
  messagesIds: Array<any>;
  showMessageNumber: number;
  totalMessageCount: number;
  widgetIsSearchOpen: boolean;
}


class MessageSearchComponent extends Component<SearchProps, SearchState> {

  state = {
    searchText: '',
    // id сообщений, которые совпадают с текстом поиска
    searchMessagesIds: [],
    // id сообщений
    messagesIds: [],
    // номер отображаемого сообщения
    showMessageNumber: 0,
    // всего сообщений
    totalMessageCount: 0,
    widgetIsSearchOpen: false,
  };

  input: HTMLInputElement = null;

  debouncedTriggerSearch = debounce(this.getEntryTextPoint.bind(this), 400);

  componentDidMount() {
    const { elixirChatWidget } = this.props;

    elixirChatWidget.on(WIDGET_SEARCH_TOGGLE, widgetIsSearchOpen => {
      this.setState({ widgetIsSearchOpen });
      if (widgetIsSearchOpen) {
        this.input.focus();
        this.setState({searchText: ''});
      }
    });
  }

  componentDidUpdate(prevProps: Readonly<SearchProps>, prevState: Readonly<SearchState>, snapshot?: any) {
   if (this.props.searchMessagesIds.length && JSON.stringify(this.props.searchMessagesIds) !== JSON.stringify(prevProps.searchMessagesIds)) {
     this.loadMessageLogic(this.props.searchMessagesIds[0], 'up');
     this.setState({
       totalMessageCount: this.props.searchMessagesIds.length,
       showMessageNumber: 1
     })
   }
  }

  /**
   * Получение всех сообщений с текстом запроса
   */
  getEntryTextPoint(value) {
    const { elixirChatWidget } = this.props;

    const normalizedSearchTerm = value.trim();
    if (normalizedSearchTerm) {
      elixirChatWidget.fetchMessageBySearch(normalizedSearchTerm);
    }
    this.props.onChangeText(normalizedSearchTerm);
  }

  /**
   * Переход по результатам поиска с использованием стрелочек.
   * @param event
   */
  keyPress = (event) => {
    const {keyCode} = event;
    const arrowDirection = [38, 40];
    const escCode = 27;
    const enterCode = 13;

    if (keyCode === enterCode && this.props.searchMessagesIds[0]) {
        this.props.onScroll(this.props.searchMessagesIds[0]);
    }

    if (keyCode === escCode) {
      this.handleCloseSearch();
    }

    if (!arrowDirection.includes(keyCode)) {
        return;
    }
    event.preventDefault();

    const {showMessageNumber, totalMessageCount} = this.state;
    const disabledPrevBtn = !(totalMessageCount && showMessageNumber < totalMessageCount);
    const disabledNextBtn = !(totalMessageCount && showMessageNumber > 1);

    if (keyCode === 38 && !disabledPrevBtn) { // up arrow
        this.showPrevMessage();
    } else if (keyCode === 40 && !disabledNextBtn ) { // down arrow
        this.showNextMessage();
    }
  }

  handleChange = (event) => {
    const {value} = event.target;
    this.setState({searchText: value});
    this.debouncedTriggerSearch(value);
  }

  /**
   * Переход к предыдущему сообщению
   */
  showPrevMessage = () => {
    const {showMessageNumber} = this.state;
    const messageId = this.props.searchMessagesIds[showMessageNumber];
    this.setState({showMessageNumber: showMessageNumber + 1});
    this.loadMessageLogic(messageId, 'up');
  }

  /**
   * Переход к следующему сообщению
   */
  showNextMessage = () => {
    const {showMessageNumber} = this.state;
    const messageId = this.props.searchMessagesIds[showMessageNumber - 2];
    this.setState({showMessageNumber: showMessageNumber - 1});
    this.loadMessageLogic(messageId, 'down');
  }

  /**
   * Проверка на необходимость подгрузки сообщений или переход к существующему
   * @param messageId
   * @param direction
   */
  loadMessageLogic = (messageId, direction) => {
    if (this.props.messagesIds.includes(messageId)) {
      this.props.onScroll(messageId);
    } else {
      const { elixirChatWidget, searchMessagesCursors } = this.props;
      elixirChatWidget.loadHistoryMessageBySearch(searchMessagesCursors[messageId]);

      // this.loadPrevMessages(messageId, direction);
    }
  }

  clearSearchResult = () => {
    this.setState({showMessageNumber: 0, totalMessageCount: 0, searchText: ''});
    this.props.onChangeText('');
  }

  /**
   * Закрытие окна с поиском
   */
  handleCloseSearch = () => {
    const { elixirChatWidget } = this.props;

    elixirChatWidget.closeSearch();
    this.clearSearchResult();
  }

  render() {
    const {className} = this.props;
    const {searchText, widgetIsSearchOpen} = this.state;

    const {showMessageNumber, totalMessageCount} = this.state;
    const disabledPrevBtn = !(totalMessageCount && showMessageNumber < totalMessageCount);
    const disabledNextBtn = !(totalMessageCount && showMessageNumber > 1);

    return (
      <div className={cn({
        className: !!className,
        'elixirchat-chat__search-wrapper_close': !widgetIsSearchOpen,
        'elixirchat-chat__search-wrapper': true,
      })}>
        <div className="elixirchat-chat__search-form">
          <input
            ref={tag => {
              this.input = tag;
            }}
            type="text"
            className="elixirchat-chat__search-input"
            value={searchText}
            placeholder="Поиск"
            onKeyDown={this.keyPress}
            onChange={this.handleChange}/>
          <div className="elixirchat-chat__search__buttons-group">
            <button
              className="elixirchat-chat__search-button elixirchat-chat__search-button_prev"
              onClick={this.showPrevMessage}
              disabled={disabledPrevBtn}
            >
              <svg width="15" height="8" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M1.156 6.89a.523.523 0 0 0-.125.173.583.583 0 0 0 .032.484c.046.078.109.14.187.187.083.047.174.07.273.07.167 0 .295-.049.383-.148l5.938-6.234h-.688l5.93 6.234a.518.518 0 0 0 .383.149.521.521 0 0 0 .46-.258.481.481 0 0 0 .079-.274.5.5 0 0 0-.164-.375L7.922.664a.67.67 0 0 0-.195-.148A.5.5 0 0 0 7.5.46a.556.556 0 0 0-.422.195L1.156 6.891Z"
                  fill="currentColor"/>
              </svg>
              <span>Предыдущий</span>
            </button>
            <button
              className="elixirchat-chat__search-button elixirchat-chat__search-button_next"
              onClick={this.showNextMessage}
              disabled={disabledNextBtn}
            >
              <span>Следующий</span>
              <svg width="15" height="9" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M7.5 8.29a.57.57 0 0 0 .227-.048.67.67 0 0 0 .195-.148l5.922-6.242a.516.516 0 0 0 .086-.649.52.52 0 0 0-.188-.195.521.521 0 0 0-.273-.07.538.538 0 0 0-.383.156l-5.93 6.234h.688L1.906 1.094a.504.504 0 0 0-.383-.157.548.548 0 0 0-.273.07.548.548 0 0 0-.258.469c0 .079.013.149.04.212a.66.66 0 0 0 .124.171l5.922 6.235c.13.13.271.195.422.195Z"
                  fill="currentColor"/>
              </svg>
            </button>
          </div>
        </div>
        <button className="elixirchat-chat__search-button_close" onClick={this.handleCloseSearch}>
          <svg width="15" height="15" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M10 20a10 10 0 0 0 9.2-13.9A10.2 10.2 0 0 0 10 0a9.6 9.6 0 0 0-7 3C2 3.9 1.2 5 .7 6a9.7 9.7 0 0 0 2.2 11 10.2 10.2 0 0 0 7 2.9Zm0-1.3a8.5 8.5 0 0 1-6.2-2.5A8.8 8.8 0 0 1 1.3 10a8.6 8.6 0 0 1 2.5-6.2A8.6 8.6 0 0 1 10 1.3a8.5 8.5 0 0 1 6.2 2.5 8.7 8.7 0 0 1-6.2 15Zm-3.5-4.6c.2 0 .4 0 .5-.2l3-3 3 3a.6.6 0 0 0 1 0l.1-.4c0-.2 0-.3-.2-.5l-3-3 3-3 .2-.5c0-.2 0-.3-.2-.4a.6.6 0 0 0-.4-.2c-.2 0-.3 0-.5.2l-3 3-3-3a.6.6 0 0 0-.5-.2c-.2 0-.3 0-.4.2l-.2.4c0 .2 0 .3.2.5l3 3-3 3-.2.5c0 .2 0 .3.2.4.1.2.2.2.4.2Z"
              fill="currentColor"/>
          </svg>
          <span>Закрыть</span>
        </button>
      </div>
    )
  }
}

// @ts-ignore
export const MessageSearch = injectIntl(MessageSearchComponent)
