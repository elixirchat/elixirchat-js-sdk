import { css } from '../../../utils';
export default css`

.elixirchat-chat-messages {
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
