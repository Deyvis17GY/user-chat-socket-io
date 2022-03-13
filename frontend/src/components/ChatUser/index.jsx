import clsx from 'clsx';
import React, { useEffect, useState } from 'react';
import { getAllMessages } from '@src/services/api';
import { formatDate } from '@src/utils/formatDate';
import PropTypes from 'prop-types';
import styles from './chat.module.css';

const URL = import.meta.env.VITE_WS_URL;

export const ChatUser = ({ showChat, userName }) => {
  const [message, setMessage] = useState([]);
  const [messages, setMessages] = useState([]);
  const [ws, setWs] = useState(new WebSocket(URL));

  const isDisabled = clsx(styles.send, {
    [styles.sendDisabled]: !message.length
  });

  const getMessages = async () => {
    const data = await getAllMessages();
    if (!data) return;
    setMessages(data.data);
  };

  const formatHour = () => {
    return formatDate(new Date(), 'en-ES', {
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: true
    });
  };

  useEffect(() => {
    getMessages();
  }, []);

  useEffect(() => {
    ws.onopen = () => {
      console.log('WebSocket Connected');
    };

    ws.onmessage = ({ data }) => {
      const message = JSON.parse(data);
      setMessages([message, ...messages]);
    };

    return () => {
      ws.onclose = () => {
        console.log('WebSocket Disconnected');
        setWs(new WebSocket(URL));
      };
    };
  }, [ws.onmessage, ws.onopen, ws.onclose, messages]);
  const submitMessage = (msg) => {
    const message = { user: userName, message: msg };
    ws.send(JSON.stringify(message));
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
                <em>{message.message}</em>
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
