import { css } from '../../../utils';
import chatAttachIconBlack from '../assets/images/chat-attach-icon-black.svg';
import chatAttachIconBlue from '../assets/images/chat-attach-icon-blue.svg';
import chatAttachIconWhite from '../assets/images/chat-attach-icon-white.svg';
import chatRemoveIconBlue from '../assets/images/chat-remove-icon-blue.svg';
import chatScreenshotIconBlack from '../assets/images/chat-screenshot-icon-black.svg';
import chatScreenshotIconBlue from '../assets/images/chat-screenshot-icon-blue.svg';
import chatScreenshotIconWhite from '../assets/images/chat-screenshot-icon-white.svg';


export default css`

.elixirchat-chat-textarea {
  height: 110px;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #ffffff;
  z-index: 3;
  box-shadow: 0 -1px 0 rgba(0,0,0,.15);
}

.elixirchat-chat-textarea__actions {
  position: absolute;
  right: 20px;
  bottom: 20px;
  z-index: 2;
}

.elixirchat-chat-textarea__actions-screenshot,
.elixirchat-chat-textarea__actions-attach {
  width: 38px;
  height: 31px;
  border: 1px solid #D5D5D5;
  border-radius: 7px;
  position: relative;
  margin-left: 10px;
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

.elixirchat-chat-textarea__textarea {
  border: 0;
  position: relative;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  padding: 20px 120px 20px 30px;
  resize: none;
  height: 100%;
  width: 100%;
}

`
