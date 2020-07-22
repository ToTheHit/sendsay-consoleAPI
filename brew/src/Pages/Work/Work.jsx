import React, { useEffect } from 'react';
import './work.css';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Header from '../../components/Work/Header/Header';
import HistoryTrack from '../../components/Work/HistoryTrack/HistoryTrack';
import Dropdown from '../../components/Work/HistoryTrack/Components/Dropdown/Dropdown';
import Editor from '../../components/Work/Editor/Editor';
import globalVariables from '../../GlobalVariables';

const Work = (props) => {
  const history = useHistory();
  const dispatch = useDispatch();

  const sendsayBridge = useSelector((state) => state.sendsayBridge.sendsay);
  const userInfo = useSelector((state) => state.userInfo);

  // Проверка токена
  useEffect(() => {
    sendsayBridge.setSessionFromCookie('sendsay_session');
    sendsayBridge.request({
      action: 'pong',
    })
      .catch((err) => {
        console.info('pongErr', err);
        history.push('/');
      })
      .then(() => {
        let actions = [];
        sendsayBridge.request({
          action: 'sys.storage.get',
          id: globalVariables.actionsIDinStorage,
        })
          .then((data) => {
            actions = data.obj.data;
          })
          .catch((err) => console.info('Error when fetch data', err))
          .finally(() => {
            dispatch({
              type: 'UPDATE_USER_INFO',
              payload: {
                actions: (actions.length ? actions : []),
                isUpdatedFromServer: true,
              },
            });
          });
      });
  }, []);

  useEffect(() => {
    if (userInfo.isUpdatedFromServer) {
      sendsayBridge.request({
        action: 'sys.storage.set',
        id: globalVariables.actionsIDinStorage,
        obj: {
          data: userInfo.actions,
        },
        return_fresh_obj: 0,
      })
        // .then((data) => console.info(data))
        .catch((err) => console.info('Error when set data in storage', err));
    }
  }, [userInfo]);

  return (
    <div className="Work">
      <Dropdown />

      <Header />
      <HistoryTrack />
      <Editor />
    </div>
  );
};

Work.propTypes = {};
Work.defaultProps = {};
export default Work;
