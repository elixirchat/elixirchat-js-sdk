import { css } from '../../utils';
import widgetIconChat from './assets/images/widget-icon-chat.svg';
import widgetIconClose from './assets/images/widget-icon-close.svg';

export default css`

.elixirchat-widget-button {
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 60px;
  height: 60px;
  border: 0;
  cursor: pointer;
  border-radius: 100%;
  background-color: #FF006E;
  box-shadow: 0 0 25px rgba(0,0,0,.15);
  outline: none;
  z-index: 999999;
}

.elixirchat-widget-button:after,
.elixirchat-widget-button:before {
  content: "";
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  transition: opacity 300ms;
}

.elixirchat-widget-button:after {
  background: url("${widgetIconChat}") no-repeat center 18px;
  background-size: 29px;
}

.elixirchat-widget-button:before {
  background: url("${widgetIconClose}") no-repeat center 21px;
  background-size: 20px;
}

.elixirchat-widget-button:before {
  opacity: 0;
}

.elixirchat-widget-button--active:after {
  opacity: 0;
}

.elixirchat-widget-button--active:before {
  opacity: 1;
}

.elixirchat-widget-iframe {
  border-radius: 8px;
  background: #ffffff;
  position: fixed;
  max-height: 600px;
  height: calc(100vh - 130px);
  width: 380px;
  bottom: 100px;
  right: 30px;
  border: 0;
  box-shadow: 0 0 60px rgba(0,0,0,.15);
  z-index: 999998;
}

`
