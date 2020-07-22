import React, { useEffect, useState } from 'react';
import './auth.css';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Logo from '../../components/Global/Logo/Logo';
import Emoji from '../../assets/Auth/emoji-neutral.svg';
import classNames from '../../lib/classNames';
import Button from '../../components/Global/Button/Button';

const Auth = () => {
  const history = useHistory();
  const regexpPassword = /[^a-z0-9_ ]/gi;
  const regexpLogin = /[^a-z0-9_@.]/gi;
  const [isSending, setIsSending] = useState(false);
  const [loginIsInvalid, setLoginIsInvalid] = useState(false);
  const [passwordIsInvalid, setPasswordIsInvalid] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [formData, setFormData] = useState({
    login: '',
    sublogin: '',
    password: '',
  });
  const sendsayBridge = useSelector((state) => state.sendsayBridge.sendsay);

  useEffect(() => {
    sendsayBridge.setSessionFromCookie('sendsay_session');
    sendsayBridge.request({
      action: 'pong',
    })
      .then(() => {
        history.push('/work');
      })
      .catch((err) => {
        console.info('pongErr', err);
      });
  }, []);

  function checkFormData() {
    if (!isSending) {
      if (formData.login && !formData.login.match(regexpLogin)) {
        if (formData.password && !formData.password.match(regexpPassword)) {
          setLoginError('');
          setIsSending(true);
          sendsayBridge.login({
            login: formData.login,
            sublogin: formData.sublogin,
            password: formData.password,
          }).then((data) => {
            console.info('login -> ok', data);
            document.cookie = `sendsay_session=${sendsayBridge.session}`;
            setIsSending(false);
            history.push('/work');
          })
            .catch((err) => {
              if (!err.id && !err.explain) {
                setLoginError(err.toString());
              } else setLoginError(JSON.stringify({ id: err.id, explain: err.explain }));
              setIsSending(false);
            });
        } else {
          setPasswordIsInvalid(true);
        }
      } else {
        setLoginIsInvalid(true);
      }
    }
  }

  return (
    <div className="Auth">
      <div className="Auth__wrapper">
        <Logo />

        <div className="Auth__container">
          <div className="Auth__content">
            <h1 className="Auth__title">API-консолька</h1>
            {loginError && (
              <div className="Auth__badRequest">
                <div className="Auth__badRequest__content">
                  <Emoji className="Auth__badRequest--emoji" />
                  <div>
                    <div className="Auth__badRequest__title">Вход не вышел</div>
                    <div className="Auth__badRequest__explanation">{loginError}</div>
                  </div>
                </div>
              </div>
            )}

            <form className="Auth__form">
              <label
                className={classNames('Auth__label', (loginIsInvalid && 'Auth__label--invalid'))}
              >
                Логин
              </label>
              <input
                className={classNames('Auth__input', (loginIsInvalid && 'Auth__input--invalid'))}
                type="text"
                required={loginIsInvalid}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    login: e.target.value,
                  });
                  if (loginIsInvalid) setLoginIsInvalid(false);
                }}
              />

              <label className="Auth__label">
                <span>Сублогин</span>
                <span className="Auth__label--optional">Опционально</span>
              </label>
              <input
                className="Auth__input"
                type="text"
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    sublogin: e.target.value,
                  });
                }}
              />

              <label
                className={classNames('Auth__label', (passwordIsInvalid && 'Auth__label--invalid'))}
              >
                Пароль
              </label>
              <input
                className={classNames('Auth__input', (passwordIsInvalid && 'Auth__input--invalid'))}
                type="password"
                required={passwordIsInvalid}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    password: e.target.value,
                  });
                  if (passwordIsInvalid) setPasswordIsInvalid(false);
                }}
              />
              <Button
                className="Auth__button"
                onClick={() => checkFormData()}
                isSending={isSending}
                isDisabled={(loginIsInvalid)}
              >
                Войти
              </Button>
            </form>
          </div>
        </div>

        <a href="https://github.com/ToTheHit" className="Auth__github">@ToTheHit</a>
      </div>
    </div>
  );
};

Auth.propTypes = {};
Auth.defaultProps = {};
export default Auth;
