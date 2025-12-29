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

import s from './DeleteReservatioByManager.module.css';
let userID, userID$, reservationID, reservationID$;

function DeleteReservationByManager() {
  function handleFormSubmit(e) {
    e.preventDefault();
    e.target.userId_drm.value = '';
    e.target.reservationId_drm.value = '';

    from(userID)
      .pipe(
        debounceTime(300),
        mergeMap((data) => {
          return fetch(
            `http://localhost/reservations/manager/${userID}/${reservationID}`,
            {
              method: 'DELETE',
              credentials: 'include',
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
    const userID_ = document.getElementById('userId_drm');
    userID$ = fromEvent(userID_, 'change')
      .pipe(map((e) => e.target.value))
      .subscribe((data) => {
        userID = data;
      });

    const reservationID_ = document.getElementById('reservationId_drm');
    reservationID$ = fromEvent(reservationID_, 'change')
      .pipe(map((e) => e.target.value))
      .subscribe((data) => {
        reservationID = data;
      });

    return () => {
      if (userID$) {
        userID$.unsubscribe();
      }
      if (reservationID$) {
        reservationID$.unsubscribe();
      }
    };
  }, []);

  return (
    <div>
      <br />
      <h3>Удаление брони конкретного пользователя// MANAGER </h3>
      <form onSubmit={handleFormSubmit}>
        <label>
          id пользователя
          <input id='userId_drm' type='text' />
        </label>
        <br />
        <label>
          id брони
          <input id='reservationId_drm' type='text' />
        </label>
        <br />

        <button type='submit'>Удалить бронь</button>
      </form>
    </div>
  );
}
export default DeleteReservationByManager;
