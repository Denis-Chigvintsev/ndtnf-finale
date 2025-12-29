import s from './SendMessageHttp.module.css';
import {
  from,
  debounceTime,
  exhaustMap,
  switchMap,
  fromEvent,
  map,
} from 'rxjs';
import { useEffect } from 'react';

let text;
let reqid;

function SendMessageHttp() {
  function handleFormSubmit(e) {
    e.preventDefault();

    const messageDto = {
      text: text,
    };
    console.log(messageDto, reqid);
    e.target.text_smh.value = '';
    e.target.reqid_smh.value = '';

    from(JSON.stringify(messageDto))
      .pipe(
        debounceTime(300),
        exhaustMap((data) => {
          console.log(600, JSON.stringify(messageDto));
          return fetch(
            `http://localhost/support/support-request/message/client/manager/${reqid}`,
            {
              method: 'POST',
              credentials: 'include',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(messageDto),
            }
          )
            .then((res) => res.json())
            .then((json) => console.log(json))
            .catch((error) => console.log(error));
        })
      )
      .subscribe(console.log);
  }
  useEffect(() => {
    const text_ = document.getElementById('text_smh');
    const text$ = fromEvent(text_, 'change')
      .pipe(map((e) => e.target.value))
      .subscribe((data) => {
        text = data;
      });

    const reqid_ = document.getElementById('reqid_smh');
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

  return (
    <div>
      <br />
      <h3>
        Отправка сообщений в техподдержку по Http // Client // Manager // Admin
      </h3>
      <form onSubmit={handleFormSubmit}>
        <br />

        <label>
          Номер обращения
          <input type='text' id='reqid_smh' />
        </label>
        <br />
        <label>
          Сообщение:
          <br />
          <textarea id='text_smh' type='text' rows='4' cols='50'></textarea>
        </label>
        <br />
        <button>Отправить</button>
      </form>
    </div>
  );
}

export default SendMessageHttp;
