/* eslint-disable no-undef */
import { debounceTime, exhaustMap, fromEvent, take, map, from } from 'rxjs';
import s from './Logout.module.css';
import { use, useEffect } from 'react';

function Logout() {
  function handleClick(e) {
    from([e])
      .pipe(
        debounceTime(300),
        exhaustMap(() => {
          return fetch('http://localhost/api/auth/logout', {
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
          })
            .then((res) => res.json())
            .then((json) => {
              console.log(json);
            })
            .catch((error) => console.log(error));
        }),
        take(1)
      )
      .subscribe();
  }

  return (
    <div>
      <br />
      <h3>Выход из системы // client/manager/admin</h3>
      <button onClick={handleClick}> Выход </button>
    </div>
  );
}
export default Logout;
