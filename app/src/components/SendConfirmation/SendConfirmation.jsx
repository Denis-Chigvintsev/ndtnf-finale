import s from './SendConfirmation.module.css';
import { exhaustMap, from, fromEvent, debounceTime, map } from 'rxjs';
import { useEffect } from 'react';

let id, arrNumber;

function SendConfirmation() {
  function handleFormSubmit(e) {
    e.preventDefault();

    e.target.id_sc.value = '';
    e.target.arrNumber_sc.value = '';

    const confirmationDto = { id, arrNumber };

    from(JSON.stringify(confirmationDto))
      .pipe(
        debounceTime(300),
        exhaustMap((data) => {
          return fetch(
            `http://localhost/support/support-request/read-confirmation/client/manager`,

            {
              method: 'POST',
              credentials: 'include',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(confirmationDto),
            }
          )
            .then((res) => res.json())
            .then((json) => console.log(json))
            .catch((error) => console.log(error));
        })
      )
      .subscribe();
  }

  useEffect(() => {
    const id_ = document.getElementById('id_sc');
    const id$ = fromEvent(id_, 'change')
      .pipe(map((e) => e.target.value))
      .subscribe((data) => {
        id = data;
      });

    const arrNumber_ = document.getElementById('arrNumber_sc');
    const arrNumber$ = fromEvent(arrNumber_, 'change')
      .pipe(map((e) => e.target.value))
      .subscribe((data) => {
        arrNumber = data;
      });
  }, []);

  return (
    <div>
      <br />
      <h3>
        Отправка подтверждения о прочтении сообщения // Client // Manager //
        Admin
      </h3>
      <br />
      <form onSubmit={handleFormSubmit}>
        <label>
          номер обращения:
          <input id='id_sc' type='text' />
        </label>
        <br />
        <label>
          номер сообщения в массиве сообщений обращения в поддержку:
          <input id='arrNumber_sc' type='text' />
        </label>
        <br />

        <button type='submit'>Отправить подтверждение</button>
      </form>
      <br />
    </div>
  );
}

export default SendConfirmation;
