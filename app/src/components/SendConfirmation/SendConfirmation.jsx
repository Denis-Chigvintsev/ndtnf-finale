import s from './SendConfirmation.module.css';
import { exhaustMap, from, fromEvent, debounceTime, map } from 'rxjs';
import { useEffect } from 'react';

let id, createdBefore;

function SendConfirmation() {
  function handleFormSubmit(e) {
    e.preventDefault();

    e.target.id_sc.value = '';
    e.target.createdBefore_sc.value = '';

    const confirmationDto = { createdBefore };

    from(JSON.stringify(confirmationDto))
      .pipe(
        debounceTime(300),
        exhaustMap((data) => {
          return fetch(
            `http://localhost/api/common/support-requests/${id}/messages/read`,

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

    const createdBefore_ = document.getElementById('createdBefore_sc');
    const createdBefore$ = fromEvent(createdBefore_, 'change')
      .pipe(map((e) => e.target.value))
      .subscribe((data) => {
        createdBefore = data;
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
          дата, до которой сообщения будут считаться прочитанными:
          <input id='createdBefore_sc' type='date' required />
        </label>
        <br />

        <button type='submit'>Отправить подтверждение</button>
      </form>
      <br />
    </div>
  );
}

export default SendConfirmation;
