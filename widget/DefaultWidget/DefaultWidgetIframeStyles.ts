import { css } from '../../utils';
import fontGraphikRegular from './assets/fonts/Graphik-Regular-Web.woff';
import fontGraphikBold from './assets/fonts/Graphik-Bold-Web.woff';
import chatAttachIconBlack from './assets/images/chat-attach-icon-black.svg';
import chatAttachIconBlue from './assets/images/chat-attach-icon-blue.svg';
import chatAttachIconWhite from './assets/images/chat-attach-icon-white.svg';
import chatCloseIconBlack from './assets/images/chat-close-icon-black.svg';
import chatRemoveIconBlue from './assets/images/chat-remove-icon-blue.svg';
import chatScreenshotIconBlack from './assets/images/chat-screenshot-icon-black.svg';
import chatScreenshotIconBlue from './assets/images/chat-screenshot-icon-blue.svg';
import chatScreenshotIconWhite from './assets/images/chat-screenshot-icon-white.svg';
import chatTypingIconBlack from './assets/images/chat-typing-icon-black.svg';

export const headerHeight = 53;

export default css`

@font-face {
  font-family: "Graphik";
  font-weight: normal;
  src: url("${fontGraphikRegular}") format("woff");
}

@font-face {
  font-family: "Graphik";
  font-weight: bold;
  src: url("${fontGraphikBold}") format("woff");
}

body {
  margin: 0;
  padding: 0;
  font-family: Graphik, 'Helvetica Neue', sans-serif;
  font-size: 14px;
  line-height: 18px;
  color: #151319;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

input,
button,
textarea {
  font: 14px/18px Graphik, 'Helvetica Neue', sans-serif;
  outline: none;
}

.elixirchat-chat-header {
  margin: 0;
  font-size: 16px;
  height: ${headerHeight}px;
  box-sizing: border-box;
  box-shadow: 0 1px 0 rgba(0,0,0,.15);
  padding: 19px 0 0 30px;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 2;
  background: #ffffff;
}

.elixirchat-chat-header__indicator {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 100%;
  background: #50C900;
  vertical-align: middle;
  margin-right: 8px;
  margin-top: -2px;
}

.elixirchat-chat-header__close {
  width: ${headerHeight}px;
  height: ${headerHeight - 1}px;
  border: 0;
  background: transparent url("${chatCloseIconBlack}") no-repeat center;
  background-size: 15px;
  opacity: .22;
  position: absolute;
  top: 1px;
  right: 0;
  cursor: pointer;
  transition: opacity 200ms;
}

.elixirchat-chat-header__close:hover {
  opacity: .4;
}


/* MESSAGES */

.elixirchat-chat-messages {
  position: fixed;
  top: ${headerHeight}px;
  left: 0;
  right: 0;
  bottom: 80px;
  overflow-x: hidden;
  overflow-y: auto;
  padding: 20px 30px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.elixirchat-chat-messages__date-title {
  text-transform: uppercase;
  font-size: 12px;
  font-weight: bold;
  border-bottom: 1px solid #151319;
  line-height: 21px;
  margin-bottom: 15px;
  width: 100%;
}

.elixirchat-chat-messages__item {
  max-width: 80%;
  min-width: 50%;
  margin-bottom: 15px;
}

.elixirchat-chat-messages__sender {
  color: #0033FF;
  font-weight: bold;
  padding-bottom: 1px;
}

.elixirchat-chat-messages__text {
  white-space: pre-wrap;
}

.elixirchat-chat-messages__timestamp {
  text-align: right;
  color: #999999;
  padding-top: 3px;
}

.elixirchat-chat-messages__item--by-me .elixirchat-chat-messages__balloon {
  padding: 9px 10px 7px 10px;
  border-radius: 3px;
  background: #0033FF;
  color: #ffffff;
}

.elixirchat-chat-messages__item--by-me .elixirchat-chat-messages__sender {
  color: #ffffff;
}

.elixirchat-chat-messages__item--by-agent {
  align-self: flex-start;
}

.elixirchat-chat-messages__item--by-agent .elixirchat-chat-messages__sender {
  color: #FF006E;
}

.elixirchat-chat-messages__item--by-agent .elixirchat-chat-messages__timestamp {
  text-align: left;
}


`
