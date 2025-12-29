import { useEffect } from 'react';
import { debounceTime, fromEvent, map, from, exhaustMap } from 'rxjs';

let userId;

//import s from './UserDowngradeClient.module.css';

function UserDowngradeClient() {
  function handleFormSubmit(e) {
    e.preventDefault();

    e.target.userId_uu1.value = '';

    from(JSON.stringify(userId))
      .pipe(
        exhaustMap((data) => {
          return fetch(`http://localhost/users/upgrade/admin/${userId}`, {
            method: 'PATCH',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },

            body: JSON.stringify({ role: 'client' }),
          })
            .then((res) => res.json())
            .then((json) => console.log(json))
            .catch((error) => console.log(error));
        })
      )
      .subscribe();
  }

  useEffect(() => {
    const userId_ = document.getElementById('userId_uu1');
    const userId$ = fromEvent(userId_, 'change')
      .pipe(map((e) => e.target.value))
      .subscribe((data) => {
        userId = data;
      });
  }, []);

  return (
    <form onSubmit={handleFormSubmit}>
      <br />
      <h3>Изменение статуса пользователя на `client` // Admin </h3>
      <label>
        User id:
        <input id='userId_uu1' type='text' />
      </label>
      <br />

      <button type='submit'>Сделать пользователя клиентом</button>
    </form>
  );
}

export default UserDowngradeClient;
