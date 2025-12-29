import {
  debounceTime,
  from,
  switchMap,
  fromEvent,
  map,
  mergeMap,
  take,
} from 'rxjs';

import { useEffect } from 'react';

import s from './DeleteReservation.module.css';
let resID, resID$;

function DeleteReservation() {
  function handleFormSubmit(e) {
    e.preventDefault();
    e.target.res_dr.value = '';
    from(resID)
      .pipe(
        debounceTime(300),
        mergeMap((data) => {
          return fetch(`http://localhost/reservations/client/${resID}`, {
            method: 'DELETE',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
          })
            .then((res) => res.json())
            .then((json) => console.log(json))
            .catch((error) => console.log(error));
        })
      )
      .subscribe();
  }

  useEffect(() => {
    const resID_ = document.getElementById('res_dr');
    resID$ = fromEvent(resID_, 'change')
      .pipe(map((e) => e.target.value))
      .subscribe((data) => {
        resID = data;
      });

    return () => {
      if (resID$) {
        resID$.unsubscribe();
      }
    };
  }, []);

  return (
    <div>
      <br />
      <h3>Удаление бронирования// Client </h3>

      <form onSubmit={handleFormSubmit}>
        <label>
          id бронирования
          <input id='res_dr' type='text' />
        </label>
        <br />
        <button type='submit'>Удалить бронирование</button>
      </form>
    </div>
  );
}
export default DeleteReservation;
