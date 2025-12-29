import { useEffect } from 'react';
import { debounceTime, fromEvent, map, from, exhaustMap, take } from 'rxjs';

let email;
let password;

//import s from './Login.module.css';

function Login() {
  function handleFormSubmit(e) {
    e.preventDefault();

    const login = {
      email: email,
      password: password,
    };

    console.log(login);
    e.target.email1.value = '';
    e.target.password1.value = '';

    from(JSON.stringify(login))
      .pipe(
        debounceTime(300),
        exhaustMap((data) => {
          console.log(600, JSON.stringify(login));
          return fetch('http://localhost/authentication/signin', {
            method: 'POST',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(login),
          })
            .then((res) => res.json())
            .then((json) => {
              console.log(json);
              alert('Перезагружаю локацию?');
              window.location.reload();
            })
            .catch((error) => console.log(error));
        })
      )
      .subscribe(console.log);
  }

  useEffect(() => {
    const email_ = document.getElementById('email1');
    const email$ = fromEvent(email_, 'change')
      .pipe(map((e) => e.target.value))
      .subscribe((data) => {
        email = data;
      });

    const password_ = document.getElementById('password1');
    const pss$ = fromEvent(password_, 'change')
      .pipe(map((e) => e.target.value))
      .subscribe((data) => {
        password = data;
        console.log(500, data);
      });
  }, []);

  return (
    <form onSubmit={handleFormSubmit}>
      <br />
      <h3>Вход в систему</h3>
      <label>
        Электронная почта:
        <input id='email1' type='text' />
      </label>
      <br />
      <label>
        Пароль:
        <input type='text' id='password1' />
      </label>
      <br />

      <button type='submit'>Войти</button>
    </form>
  );
}

export default Login;
