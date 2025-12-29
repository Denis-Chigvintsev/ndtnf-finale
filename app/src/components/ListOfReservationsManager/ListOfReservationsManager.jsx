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

import s from './ListOfReservationsManager.module.css';
let userID, userID$;

function ListOfReservationsManager() {
  function handleFormSubmit(e) {
    e.preventDefault();
    e.target.userId_lor.value = '';
    from(userID)
      .pipe(
        debounceTime(300),
        switchMap((data) => {
          return fetch(`http://localhost/reservations/manager/${userID}`, {
            credentials: 'include',
          })
            .then((res) => res.json())
            .then((json) => console.log(json))
            .catch((error) => console.log(error));
        })
      )
      .subscribe();
  }

  useEffect(() => {
    const userID_ = document.getElementById('userId_lor');
    userID$ = fromEvent(userID_, 'change')
      .pipe(map((e) => e.target.value))
      .subscribe((data) => {
        userID = data;
      });

    return () => {
      if (userID$) {
        userID$.unsubscribe();
      }
    };
  }, []);

  return (
    <div>
      <br />
      <h3>Вывести брони конкретного пользователя// MANAGER </h3>

      <form onSubmit={handleFormSubmit}>
        <label>
          id пользователя
          <input id='userId_lor' type='text' />
        </label>
        <br />

        <button type='submit'>Вывести брони пользователя</button>
      </form>
    </div>
  );
}
export default ListOfReservationsManager;
