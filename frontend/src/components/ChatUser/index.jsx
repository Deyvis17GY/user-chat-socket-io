import clsx from 'clsx';
import React, { useEffect, useState } from 'react';
import { getAllMessages } from '@src/services/api';
import { formatDate } from '@src/utils/formatDate';
import PropTypes from 'prop-types';
import styles from './chat.module.css';
import { useWebSocket } from '@src/hooks/useWebSocket';
import favicon from '../../assets/chat.png';

export const ChatUser = ({ showChat, userName }) => {
  const [message, setMessage] = useState([]);
  const { ws } = useWebSocket();
  const [messages, setMessages] = useState([]);

  const isDisabled = clsx(styles.send, {
    [styles.sendDisabled]: !message.length
  });

  const getMessages = async () => {
    if (!showChat) return;
    const data = await getAllMessages();
    if (!data) return;
    setMessages(data.data);
  };

  useEffect(() => {
    getMessages();
  }, [showChat]);

  const formatHour = () => {
    return formatDate(new Date(), 'en-ES', {
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: true
    });
  };

  const notifyMe = ({ user, message }) => {
    const options = {
      body: message,
      icon: favicon
    };
    if (!('Notification' in window)) {
      console.error('This browser does not support desktop notification');
    } else if (Notification.permission === 'granted') {
      new Notification(user, options);
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission(function (permission) {
        if (permission === 'granted') {
          new Notification(user, options);
        }
      });
    }
  };

  useEffect(() => {
    if (ws.current) {
      ws.current.onmessage = ({ data }) => {
        const message = JSON.parse(data);
        const { type, user } = message;
        if (type === 'chat') {
          notifyMe({ user, message: message.message });
          setMessages([...messages, message]);
        }
      };
    }
  }, [messages]);

  const submitMessage = (msg) => {
    const message = { type: 'chat', user: userName, message: msg };
    ws.current.send(JSON.stringify(message));
    setMessages([message, ...messages]);
  };

  if (showChat) {
    return (
      <div className={styles.chatUser}>
        <label htmlFor="user">Name : {userName}</label>

        <ul className={styles.message}>
          {messages.map((message, index) => (
            <li key={index}>
              <span className={styles.messageContent}>
                <b>{message.user}:</b>
                <em className={styles.messageEmit}>{message.message}</em>
              </span>
              <span className={styles.hour}>{message.hour || formatHour()}</span>
            </li>
          ))}
        </ul>

        <form
          action=""
          onSubmit={(e) => {
            e.preventDefault();
            submitMessage(message);
            setMessage([]);
          }}
          className={styles.form}>
          <input
            type="text"
            placeholder={'Type a message ...'}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="ant-input"
          />
          <button className={isDisabled} type="submit">
            Send
          </button>
        </form>
      </div>
    );
  } else {
    return null;
  }
};

ChatUser.propTypes = {
  showChat: PropTypes.bool.isRequired,
  userName: PropTypes.string
};
