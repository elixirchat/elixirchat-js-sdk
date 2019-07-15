import { css } from '../../../utils';
import fontGraphikRegular from '../assets/fonts/Graphik-Regular-Web.woff';
import fontGraphikBold from '../assets/fonts/Graphik-Bold-Web.woff';
import chatCloseIconBlack from '../assets/images/chat-close-icon-black.svg';
import chatTypingIconBlack from '../assets/images/chat-typing-icon-black.svg';

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
  height: 53px;
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
  width: 53px;
  height: 53px;
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

.elixirchat-chat-typing {
  position: fixed;
  background: #ffffff;
  left: 0;
  right: 0;
  bottom: 110px;
  font-weight: bold;
  color: #D5D5D5;
  padding: 0 30px 18px 56px;
  box-shadow: 0 -15px 15px 6px rgba(255,255,255,.99);
}

.elixirchat-chat-typing:before {
  content: "";
  position: absolute;
  left: 30px;
  top: 3px;
  width: 18px;
  height: 11px;
  background: url("${chatTypingIconBlack}") no-repeat center;
  background-size: contain;
  opacity: .15;
  z-index: 2;
}

`