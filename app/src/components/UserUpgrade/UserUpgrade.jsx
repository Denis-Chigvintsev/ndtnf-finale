import { useEffect } from 'react';
import { debounceTime, fromEvent, map, from, exhaustMap } from 'rxjs';

let userId;

//import s from './UserUpgrade.module.css';

function UserUpgrade() {
  function handleFormSubmit(e) {
    e.preventDefault();

    e.target.userId_uu2.value = '';

    from(JSON.stringify(userId))
      .pipe(
        exhaustMap((data) => {
          return fetch(`http://localhost/users/upgrade/admin/${userId}`, {
            method: 'PATCH',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },

            body: JSON.stringify({ role: 'manager' }),
          })
            .then((res) => res.json())
            .then((json) => console.log(json))
            .catch((error) => console.log(error));
        })
      )
      .subscribe(console.log);
  }

  useEffect(() => {
    const userId_ = document.getElementById('userId_uu2');
    const userId$ = fromEvent(userId_, 'change')
      .pipe(map((e) => e.target.value))
      .subscribe((data) => {
        userId = data;
      });
  }, []);

  return (
    <form onSubmit={handleFormSubmit}>
      <br />
      <h3>Изменение статуса пользователя на `manager` // Admin </h3>
      <label>
        User id:
        <input id='userId_uu2' type='text' />
      </label>
      <br />

      <button type='submit'>Сделать пользователя менеджером</button>
    </form>
  );
}

export default UserUpgrade;
