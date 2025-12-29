import s from './ListOfRequestsManager.module.css';
import { debounceTime, from, switchMap, fromEvent } from 'rxjs';
import { useEffect } from 'react';

let list$;

function ListOfRequestsManager() {
  useEffect(() => {
    list$ = fromEvent(document.getElementById('btn_lrm'), 'click').pipe(
      debounceTime(300),
      switchMap(async () => {
        return await fetch('http://localhost/support/support-request/manager', {
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
      <h3> Список всех запросов в техподдержку // Manager </h3>
      <button id='btn_lrm'>Вывести список</button>
    </div>
  );
}

export default ListOfRequestsManager;
