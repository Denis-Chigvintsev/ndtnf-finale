import s from './ChatEl.module.css';
import { useState } from 'react';

function ChatEl({ message }) {
  return (
    <div className={s.chatLine}>
      <p>{message.author}:</p>
      <p>{message.text}</p>
      <p>//Написано: {message.sentAt.slice(0, 10)}</p>
      <p>{message.sentAt.slice(11, 19)}UTC </p>
      {message.readAt && <p>//Прочтено: {message.readAt.slice(0, 10)} </p>}
      {message.readAt && <p> {message.readAt.slice(11, 19)} </p>}
      <br />
    </div>
  );
}
export default ChatEl;
