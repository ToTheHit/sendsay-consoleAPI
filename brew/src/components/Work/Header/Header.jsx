import React, { useCallback, useEffect, useState } from 'react';
import './header.css';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Logo from '../../Global/Logo/Logo';
import LogoutIcon from '../../../assets/Work/logout.svg';
import FullscreenOpenIcon from '../../../assets/Work/fullscreenOpen.svg';
import FullscreenCloseIcon from '../../../assets/Work/fullscreenClose.svg';

const Header = () => {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [userInfo, setUserInfo] = useState({
    email: '',
    sublogin: '',
  });
  const history = useHistory();
  const sendsayBridge = useSelector((state) => state.sendsayBridge.sendsay);

  function toggleFullscreen() {
    const isInFullScreen = (document.fullscreenElement && document.fullscreenElement !== null)
      || (document.webkitFullscreenElement && document.webkitFullscreenElement !== null)
      || (document.mozFullScreenElement && document.mozFullScreenElement !== null)
      || (document.msFullscreenElement && document.msFullscreenElement !== null);

    const docElm = document.documentElement;
    if (!isInFullScreen) {
      if (docElm.requestFullscreen) {
        docElm.requestFullscreen();
      } else if (docElm.mozRequestFullScreen) {
        docElm.mozRequestFullScreen();
      } else if (docElm.webkitRequestFullScreen) {
        docElm.webkitRequestFullScreen();
      } else if (docElm.msRequestFullscreen) {
        docElm.msRequestFullscreen();
      }
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
  }

  const fullscreenDetector = useCallback(() => {
    console.info(document.fullscreenElement);
    if (document.fullscreenElement) {
      setIsFullScreen(true);
    } else {
      setIsFullScreen(false);
    }
  }, [document.fullscreenElement]);

  useEffect(() => {
    window.addEventListener('fullscreenchange', fullscreenDetector, { passive: false });
    return () => {
      window.removeEventListener('fullscreenchange', fullscreenDetector, { passive: false });
    };
  }, [fullscreenDetector]);

  useEffect(() => {
    sendsayBridge.request({
      action: 'pong',
    })
      .then((data) => {
        setUserInfo({
          email: data.account,
          sublogin: (data.sublogin !== data.account && data.sublogin),
        });
      })
      .catch((err) => {
        console.info('Header_Pong Err', err);
      });
  }, []);

  function logout() {
    sendsayBridge.request({
      action: 'logout',
    })
      .then(() => {
        history.push('/');
      })
      .catch((err) => {
        console.info('logout Err', err);
      });
  }

  return (
    <div className="Header">
      <div>
        <Logo className="Header__logo" />
        <div className="Header__title">API-консолька</div>
      </div>
      <div>
        <div className="Header__info">
          <span>{userInfo.email}</span>
          {(userInfo.sublogin && (
            <>
              <span>:</span>
              <span>{userInfo.sublogin}</span>
            </>
          ))}

        </div>

        <button
          type="button"
          className="Header__logout"
          onClick={logout}
        >
          <div className="Header__logoutText">Выйти</div>
          <LogoutIcon className="Header__logoutIcon" />
        </button>
        <button
          className="Header__fullscreen"
          type="button"
          onClick={() => toggleFullscreen()}
        >
          {(!isFullScreen ? <FullscreenOpenIcon /> : <FullscreenCloseIcon />)}
        </button>

      </div>
    </div>
  );
};

Header.propTypes = {};
Header.defaultProps = {};
export default Header;
