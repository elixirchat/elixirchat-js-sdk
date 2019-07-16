import { css } from '../../../utils';
import chatAttachIconBlack from '../assets/images/chat-attach-icon-black.svg';
import chatAttachIconBlue from '../assets/images/chat-attach-icon-blue.svg';
import chatRemoveIconBlue from '../assets/images/chat-remove-icon-blue.svg';
import chatScreenshotIconBlack from '../assets/images/chat-screenshot-icon-black.svg';
import chatScreenshotIconBlue from '../assets/images/chat-screenshot-icon-blue.svg';
import chatTypingIconBlack from '../assets/images/chat-typing-icon-black.svg';

// TODO: figure where to use
// import chatAttachIconWhite from '../assets/images/chat-attach-icon-white.svg';
// import chatScreenshotIconWhite from '../assets/images/chat-screenshot-icon-white.svg';

export default css`

.elixirchat-chat-textarea {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #ffffff;
  z-index: 3;
  box-shadow: 0 -1px 0 rgba(0,0,0,.15);
}

.elixirchat-chat-typing {
  position: absolute;
  background: #ffffff;
  left: 0;
  right: 0;
  bottom: 100%;
  font-weight: bold;
  color: #D5D5D5;
  padding: 0 30px 18px 56px;
  box-shadow: 0 -15px 15px 6px rgba(255,255,255,.99), inset 0 -1px 0 rgba(0,0,0,.15);
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

.elixirchat-chat-textarea__actions {
  position: absolute;
  right: 20px;
  bottom: 20px;
  z-index: 2;
  transition: transform 200ms;
}

.elixirchat-chat-textarea__actions--collapsed {
  transform: translateY(9px);
}

.elixirchat-chat-textarea__actions-screenshot,
.elixirchat-chat-textarea__actions-attach {
  width: 38px;
  height: 31px;
  border: 1px solid #D5D5D5;
  border-radius: 7px;
  position: relative;
  margin-left: 10px;
  display: inline-block;
  vertical-align: top;
  box-sizing: border-box;
  overflow: hidden;
}

.elixirchat-chat-textarea__actions-screenshot:after,
.elixirchat-chat-textarea__actions-attach:after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  opacity: .25;
  cursor: pointer;
}

.elixirchat-chat-textarea__actions-screenshot:after {
  background: url("${chatScreenshotIconBlack}") no-repeat center;
  background-size: 20px 14px;
}

.elixirchat-chat-textarea__actions-attach:after {
  background: url("${chatAttachIconBlack}") no-repeat center;
  background-size: 20px 14px;
}

.elixirchat-chat-textarea__actions-attach-input {
  position: absolute;
  z-index: 1;
  opacity: 0;
}

.elixirchat-chat-textarea__actions-attach-label {
  position: absolute;
  z-index: 2;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  cursor: pointer;
}

.elixirchat-chat-textarea__textarea {
  border: 0;
  position: relative;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  padding: 17px 0 0 30px;
  margin-bottom: 17px;
  resize: none;
  width: calc(100% - 120px);
}


.elixirchat-chat-attachment-list {
  padding: 0;
  margin: -2px 0 15px 30px;
  list-style: none;
  line-height: 22px;
  color: #0033FF;
}

.elixirchat-chat-attachment-item {
  margin: 0;
  white-space: nowrap;
}

.elixirchat-chat-attachment-icon {
  display: inline-block;
  margin-right: 10px;
  width: 14px;
  height: 14px;
  background: url("${chatAttachIconBlue}") no-repeat center;
  background-size: contain;
  vertical-align: middle;
}

.elixirchat-chat-attachment-icon--screenshot {
  width: 16px;
  height: 12px;
  background: url("${chatScreenshotIconBlue}") no-repeat center;
  margin-top: -2px;
}

.elixirchat-chat-attachment-filename {
  max-width: calc(100% - 165px);
  display: inline-block;
  overflow: hidden;
  text-overflow: ellipsis;
  vertical-align: middle;
}

.elixirchat-chat-attachment-remove {
  width: 11px;
  height: 11px;
  margin-left: 9px;
  display: inline-block;
  vertical-align: middle;
  background: url("${chatRemoveIconBlue}") no-repeat center;
  background-size: contain;
}

`
