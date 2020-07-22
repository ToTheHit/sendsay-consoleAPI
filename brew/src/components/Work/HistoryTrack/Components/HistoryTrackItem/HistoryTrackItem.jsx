import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import './historyTrackItem.css';
import { useDispatch, useSelector } from 'react-redux';
import classNames from '../../../../../lib/classNames';
import Drag from '../../../../../assets/Work/drag-element.svg';

const HistoryTrackItem = (props) => {
  const {
    isSuccess, action, content, id,
  } = props;
  const [isCopied, setIsCopied] = useState(false);
  const itemRef = useRef(null);

  const dispatch = useDispatch();
  const copiedAction = useSelector((state) => state.copiedAction.id);

  useEffect(() => {
    if (copiedAction === id) {
      setIsCopied(true);
      dispatch({
        type: 'COPY_ACTION',
        payload: {
          id: '',
        },
      });
    }
  }, [copiedAction]);

  function updateDropdown(e) {
    e.stopPropagation();
    itemRef.current.scrollIntoView({ block: 'end', behavior: 'smooth' });

    // TODO: Найди способ как избавиться от таймаута
    // В текущем варианте таймаут сделан для того, чтобы событие закрытие дропдауна из
    // компонента Dropdown.jsx не приходило позднее, чем новое событие на открытие.
    setTimeout(() => {
      let x = 0; let
        y = 0;
      y = itemRef.current.getBoundingClientRect().y + 35;
      x = itemRef.current.getBoundingClientRect().right - 133;
      dispatch({
        type: 'TOGGLE_DROPDOWN',
        payload: {
          isOpen: true,
          x,
          y,
          action,
          content,
          id,
        },
      });
    }, 1);
  }

  function updateTextField() {
    dispatch({
      type: 'SET_ACTION',
      payload: {
        action: content,
      },
    });
  }

  useEffect(() => {
    if (isCopied) {
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    }
  }, [isCopied]);

  return (
    <div
      className="HistoryTrackItem"
      ref={itemRef}
      onClick={() => updateTextField()}
    >
      <div className="HistoryTrackItem__content">
        {(isCopied && <div className="HistoryTrackItem__copyAccepted">Скопировано</div>)}
        <div
          className={classNames('HistoryTrackItem__dot', isSuccess ? 'HistoryTrackItem__dot--success' : 'HistoryTrackItem__dot--failed')}
        />
        <div className="HistoryTrackItem__action">{action}</div>
        <Drag className="HistoryTrackItem__dragElement" onClick={(e) => updateDropdown(e)} />
      </div>
    </div>
  );
};

HistoryTrackItem.propTypes = {
  isSuccess: PropTypes.bool.isRequired,
  action: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
};
HistoryTrackItem.defaultProps = {};
export default HistoryTrackItem;
