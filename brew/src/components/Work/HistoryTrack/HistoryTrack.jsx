import React, { useEffect, useRef, useState } from 'react';
import './historyTrack.css';
import { useDispatch, useSelector } from 'react-redux';
import Clear from '../../../assets/Work/clear.svg';
import HistoryTrackItem from './Components/HistoryTrackItem/HistoryTrackItem';

const HistoryTrack = () => {
  const historyTrackRef = useRef(null);
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.userInfo);

  const [renderedActions, setRenderedActions] = useState([]);

  useEffect(() => {
    const rendered = userInfo.actions.map((action) => (
      <HistoryTrackItem
        key={action.id}
        isSuccess={action.isSuccess}
        serverResponse={action.response}
        action={action.action}
        id={action.id}
        content={action.content}
      />
    ));
    setRenderedActions(rendered.reverse());
  }, [userInfo]);

  function clearHistory() {
    dispatch({
      type: 'UPDATE_USER_INFO',
      payload: {
        actions: [],
      },
    });
  }

  const onWheel = (e) => {
    historyTrackRef.current.scrollTo({
      top: 0,
      left: historyTrackRef.current.scrollLeft + e.deltaY,
      behaviour: 'smooth',
    });
  };

  return (
    <div className="HistoryTrack">
      <div className="HistoryTrack__actions" ref={historyTrackRef} onWheel={onWheel}>
        {renderedActions}
      </div>
      <button className="HistoryTrack__close" onClick={clearHistory}>
        <Clear />
      </button>
    </div>
  );
};

HistoryTrack.propTypes = {};
HistoryTrack.defaultProps = {};
export default HistoryTrack;
