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
let reservationID, reservationID$;

function DeleteReservationByManager() {
  function handleFormSubmit(e) {
    e.preventDefault();
    e.target.reservationId_drm.value = '';

    from(reservationID)
      .pipe(
        debounceTime(300),
        mergeMap((data) => {
          return fetch(
            `http://localhost/api/manager/reservations/${reservationID}`,
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
    const reservationID_ = document.getElementById('reservationId_drm');
    reservationID$ = fromEvent(reservationID_, 'change')
      .pipe(map((e) => e.target.value))
      .subscribe((data) => {
        reservationID = data;
      });

    return () => {
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
