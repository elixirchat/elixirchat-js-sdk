import React, { Component } from 'react';
import cn from 'classnames';
import { ElixirChatWidget } from '../ElixirChatWidget';

export interface IWelcomeScreenProps {
  elixirChatWidget: ElixirChatWidget;
}

export interface IWelcomeScreenState {

}

export class WelcomeScreen extends Component<IWelcomeScreenProps, IWelcomeScreenState> {

  state = {
    preview: {},
  };

  componentDidMount() {
    const { elixirChatWidget } = this.props;
    console.log('__ elixirChatWidget', elixirChatWidget);
  }

  componentWillUnmount() {
    const { elixirChatWidget } = this.props;
  }

  render() {
    const {
      preview,
    } = this.state;

    let __mock_operator_avatars = [
      'https://omnichannel-mock.surge.sh/operator-1.png',
      'https://omnichannel-mock.surge.sh/operator-2.png',
      'https://omnichannel-mock.surge.sh/operator-3.png',
      'https://omnichannel-mock.surge.sh/operator-4.png',
      'https://omnichannel-mock.surge.sh/operator-5.png',
    ];

    let __mock_messengers = [
      { name: 'whatsapp', url: 'https://web.whatsapp.com/send?phone=74950884514&text=%D0%9E%D1%82%D0%BF%D1%80%D0%B0%D0%B2%D1%8C%D1%82%D0%B5%20%D0%BD%D0%B5%20%D0%B8%D0%B7%D0%BC%D0%B5%D0%BD%D1%8F%D1%8F%20%D1%8D%D1%82%D0%BE%20%D1%81%D0%BE%D0%BE%D0%B1%D1%89%D0%B5%D0%BD%D0%B8%D0%B5%20start_chat_9987ef6c-5b10-1d23-ec14-017426db6e0b' },
      { name: 'telegram', url: 'http://t-do.ru/TextBackSupportBot?start=start_chat_9987ef6c-5b10-1d23-ec14-017426db6e0b' },
      { name: 'facebook', url: 'https://www.facebook.com/messages/textback.io' },
      { name: 'vk', url: 'https://vk.me/textback?ref=start_chat_9987ef6c-5b10-1d23-ec14-017426db6e0b' },
      { name: 'viber', url: 'viber://pa?chatURI=TextBack&context=start_chat_9987ef6c-5b10-1d23-ec14-017426db6e0b' },
      { name: 'skype', url: 'skype:skype.test.user.1' },
    ];

    return (
      <div className="elixirchat-welcome-screen-container">

        <i className="elixirchat-welcome-screen-close"/>

        <div className="elixirchat-welcome-screen-top">
          <div className="elixirchat-welcome-screen-top__logo" style={{ backgroundImage: `url(${null})` }}/>
          <h1 className="elixirchat-welcome-screen-top__title">Служба заботы Хантфлоу</h1>
          <div className="elixirchat-welcome-screen-top__status">
            Онлайн <i className="elixirchat-welcome-screen-top__status-indicator"/>
          </div>
        </div>

        <div className="elixirchat-welcome-screen-operators">
          <div className="elixirchat-welcome-screen-operators__title">Отвечаем в течение пяти минут</div>
          <ul className="elixirchat-welcome-screen-operators__list">
            {__mock_operator_avatars.map(url => (
              <li className="elixirchat-welcome-screen-operators__item"
                key={url}
                style={{ backgroundImage: `url(${url})` }}/>
            ))}
            <li className="elixirchat-welcome-screen-operators__item elixirchat-welcome-screen-operators__item--count">+8</li>
          </ul>
          <button className="elixirchat-welcome-screen-operators__button">Написать в поддержку</button>
        </div>

        <div className="elixirchat-welcome-screen-channels">
          <div className="elixirchat-welcome-screen-channels__title">Поддержка в других каналах</div>
          <ul className="elixirchat-welcome-screen-channels__list">
            {__mock_messengers.map(messenger => (
              <li key={messenger.name} className="elixirchat-welcome-screen-channels__item">
                <a className={`elixirchat-welcome-screen-channels__link svg-icon-${messenger.name}`}
                  href={messenger.url}
                  target="_blank">
                </a>
              </li>
            ))}
          </ul>
        </div>

      </div>
    );
  }
}
