import s from './ListOfRequestsClient.module.css';

import { debounceTime, from, switchMap, fromEvent } from 'rxjs';
import { useEffect } from 'react';

let list$;

function ListOfRequestsClient() {
  useEffect(() => {
    list$ = fromEvent(document.getElementById('btn_lrc'), 'click').pipe(
      debounceTime(300),
      switchMap(async () => {
        return await fetch(`http://localhost/support/support-request/client`, {
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
      <h3> Список всех запросов в техподдержку // Client </h3>
      <button id='btn_lrc'>Вывести список</button>
    </div>
  );
}

export default ListOfRequestsClient;
