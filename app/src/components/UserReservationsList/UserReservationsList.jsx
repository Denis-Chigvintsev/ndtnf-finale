import { debounceTime, from, switchMap, fromEvent, take } from 'rxjs';
import s from './UserResrvationsList.module.css';
import { useEffect } from 'react';

let list$;

function UserReservationsList() {
  useEffect(() => {
    list$ = fromEvent(document.getElementById('rlu'), 'click').pipe(
      debounceTime(300),
      switchMap(async () => {
        console.log('userResList');
        return await fetch(
          'http://localhost/reservations/reservations/client',
          {
            credentials: 'include',
          }
        )
          .then((res) => res.json())
          .catch((error) => console.log(error));
      })
    );

    list$.subscribe((data) => console.log(data));

    return () => {
      if (list$) {
        list$.unsubscribe();
      }
    };
  }, []);

  return (
    <div>
      <br />
      <h3>Вывод всех броней текущего пользователя // Client</h3>
      <button id='rlu'>Вывести брони</button>
    </div>
  );
}
export default UserReservationsList;
