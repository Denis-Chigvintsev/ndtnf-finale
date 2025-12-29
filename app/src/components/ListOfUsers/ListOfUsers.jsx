import { debounceTime, from, switchMap, fromEvent } from 'rxjs';
import s from './ListOfUsers.module.css';
import { useEffect } from 'react';

let list$;

function ListOfUsers() {
  useEffect(() => {
    list$ = fromEvent(document.getElementById('users_lou'), 'click').pipe(
      debounceTime(300),
      switchMap(async () => {
        return await fetch('http://localhost/users/findall/admin/manager', {
          credentials: 'include',
        })
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
      <h3>Вывод всех пользователей // Admin //Manager</h3>
      <button id='users_lou'>Вывести пользователей</button>
    </div>
  );
}
export default ListOfUsers;
