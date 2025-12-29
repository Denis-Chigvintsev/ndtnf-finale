import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import {
  from,
  fromEvent,
  debounceTime,
  map,
  exhaustMap,
  empty,
  take,
  mergeMap,
  switchMap,
} from 'rxjs';
import s from './Socket.module.css';
import ChatEl from './ChatEl';

let text;
let reqid = '';

function Socket() {
  const [socket, setSocket] = useState(
    io('ws://localhost', {
      reconnection: true,
      autoConnect: true,
      transports: ['websocket'],
      withCredentials: true,
    })
  );

  const [messages, setMessages] = useState([]);
  function handleFormSubmit(e) {
    e.preventDefault();

    const messageDtoWS = {
      text,
      reqid,
    };

    e.target.text_s.value = '';
    // e.target.reqid_s.value = '';

    from([reqid])
      .pipe(
        debounceTime(300),
        exhaustMap((data) => {
          if (text && reqid && text !== '' && !reqid == '') {
            socket.emit('newMessage', messageDtoWS);
          }
          messageDtoWS.text = '';
          text = '';
          e.target.text_s.value = '';

          return empty();
        })
      )
      .subscribe();
  }

  function handleClick(e) {
    const readConf$ = from([e.currentTarget.id])
      .pipe(
        debounceTime(300),
        switchMap((data) => {
          const readDto = { messageNumber: e.currentTarget.id, reqid: reqid };
          socket.emit('readConf', readDto);
          return empty();
        })
      )
      .subscribe();
  }

  useEffect(() => {
    const text_ = document.getElementById('text_s');
    const text$ = fromEvent(text_, 'change')
      .pipe(map((e) => e.target.value))
      .subscribe((data) => {
        text = data;
      });

    const reqid_ = document.getElementById('reqid_s');
    const reqid$ = fromEvent(reqid_, 'change')
      .pipe(map((e) => e.target.value))
      .subscribe((data) => {
        reqid = data;
      });

    return () => {
      if (text$) {
        text$.unsubscribe();
      }
      if (reqid$) {
        reqid$.unsubscribe();
      }
    };
  }, []);

  useEffect(() => {
    socket.on('connect', () => console.log('connected'));

    socket.on('chatList', (chat) => {
      if (chat.messages[0]) {
        setMessages((prev) => [...chat.messages]);
      }
    });

    return () => {
      socket.off('connect');
      socket.off('onMessage');
      socket.off('chatList');
    };
  }, []);

  useEffect(() => {
    const button_ = document.getElementById('buttonId_s');
    const button$ = fromEvent(button_, 'click')
      .pipe(
        exhaustMap(() => {
          return fetch(
            `http://localhost/support/support-request/get/${reqid}`,
            {
              method: 'GET',
              credentials: 'include',
              headers: {
                'Content-Type': 'application/json',
              },
            }
          )
            .then((res) => res.json())
            .then((chat) => {
              if (chat?.messages) {
                setMessages((prev) => [...chat.messages]);

                socket.emit('newMessage', {
                  reqid: reqid,
                  text: 'в чате',
                });
              }
            })
            .catch((error) => {
              // console.log(error);
              return empty();
            });
        })
      )
      .subscribe();
  }, []);

  return (
    <div>
      <br />
      <h3>
        Отправка сообщений в техподдержку по WS // Client // Manager // Admin
      </h3>
      <form onSubmit={handleFormSubmit}>
        <br />
        <div className={s.horizontalString}>
          <label>
            Номер обращения:
            <input type='text' id='reqid_s' />
          </label>
          <button id='buttonId_s'>Вывод текущего чата</button>
        </div>
        <br />
        <label>
          Сообщение:
          <br />
          <textarea id='text_s' type='text' rows='4' cols='50'></textarea>
        </label>
        <br />
        <button>Отправить</button>
      </form>
      <div className={s.chatContainer}>
        <h3>Сообщения по номеру обращения </h3>
        {reqid !== '' &&
          messages.map((message, i) => (
            <div key={i} id={i} onClick={handleClick}>
              <ChatEl message={message} />
            </div>
          ))}
        {reqid == '' && (
          <div>Здесь будет спиток сообщений запроса в тех поддержку</div>
        )}
      </div>
    </div>
  );
}

export default Socket;
