import React, { useCallback, useEffect, useRef, useState, } from 'react';
import './editor.css';
import { useDispatch, useSelector } from 'react-redux';
import DragElement from '../../../assets/Work/drag-element.svg';
import classNames from '../../../lib/classNames';
import Button from '../../Global/Button/Button';
import AlignRight from '../../../assets/Work/align-right.svg';
import globalVariables from '../../../GlobalVariables';

const Editor = () => {
  const firstFieldRef = useRef(null);
  const requestTextareaRef = useRef(null);
  const responseTextareaRef = useRef(null);
  const wrapperRef = useRef(null);
  const handlerRef = useRef(null);

  const [isHandlerDragging, setIsHandlerDragging] = useState(false);
  const [isRequestFailed, setIsRequestFailed] = useState(false);
  const [isResponseFailed, setIsResponseFailed] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const sendsayBridge = useSelector((state) => state.sendsayBridge.sendsay);
  const actions = useSelector((state) => state.userInfo.actions);
  const execAction = useSelector((state) => state.execAction);
  const setAction = useSelector((state) => state.setAction);
  const dispatch = useDispatch();

  function stringToJSON(string) {
    let obj;
    obj = string
      .replace(/\n/g, '')
      .replace(/([{,])(\s*)([A-Za-z0-9_\\-]+?)\s*:/g, '$1"$3":')
      .replace(/'/g, '"');
    obj = JSON.parse(obj);
    if (typeof obj !== 'object') {
      throw new Error('Request error: text is not object');
    }
    return obj;
  }

  function prettyPrint() {
    let pretty;
    if (!requestTextareaRef.current.value) return;
    try {
      pretty = JSON.stringify(stringToJSON(requestTextareaRef.current.value), undefined, 4);
    } catch (e) {
      console.error(e);
      setIsRequestFailed(true);
      return;
    }
    requestTextareaRef.current.value = pretty;
  }

  function compareObjects(obj1, obj2) {
    for (let p in obj1) {
      if (obj1.hasOwnProperty(p) !== obj2.hasOwnProperty(p)) return false;
      switch (typeof (obj1[p])) {
        case 'object':
          if (!Object.compare(obj1[p], obj2[p])) return false;
          break;
        case 'function':
          if (typeof (obj2[p]) === 'undefined' || (p !== 'compare' && obj1[p].toString() !== obj2[p].toString())) return false;
          break;
        default:
          if (obj1[p] !== obj2[p]) return false;
      }
    }
    for (let p in obj2) {
      if (typeof (obj1[p]) === 'undefined') return false;
    }
    return true;
  };

  function sendAction(action) {
    if (isSending || !action) return;
    setIsSending(true);
    let obj;
    let isSuccess = false;
    let serverResponse;

    try {
      obj = stringToJSON(action);
    } catch (e) {
      console.error(e);
      setIsRequestFailed(true);
      setIsSending(false);
      return;
    }

    sendsayBridge.request(obj)
      .then((data) => {
        responseTextareaRef.current.value = JSON.stringify(data, undefined, 4);
        isSuccess = true;
      })
      .catch((err) => {
        responseTextareaRef.current.value = JSON.stringify(err, undefined, 4);
        serverResponse = JSON.stringify(err, undefined, 4);
        setIsResponseFailed(true);
      })
      .finally(() => {
        const temp = actions;
        for (let i = 0; i < temp.length; i += 1) {
          if (compareObjects(JSON.parse(temp[i].content), obj)) {
            temp.splice(i, 1);
            break;
          }
        }
        temp.push({
          action: obj.action,
          isSuccess,
          id: Math.random().toString(36).substr(2, 9),
          content: JSON.stringify(obj, undefined, 4),
          response: serverResponse,
        });
        if (temp.length > globalVariables.maxActionsInHistory) {
          temp.splice(0, 1);
        }
        dispatch({
          type: 'UPDATE_USER_INFO',
          payload: {
            actions: temp,
          },
        });
        setIsSending(false);
      });
  }

  const removeFailedBorder = () => {
    if (isRequestFailed) {
      setIsRequestFailed(false);
    }
    if (isResponseFailed) {
      setIsResponseFailed(false);
    }
  }

  useEffect(() => {
    if (execAction.action) {
      requestTextareaRef.current.value = execAction.action;
      if (setAction.serverResponse) {
        responseTextareaRef.current.value = setAction.serverResponse;
        setIsResponseFailed(true);
      } else {
        responseTextareaRef.current.value = '';
        setIsResponseFailed(false);
      }

      sendAction(execAction.action);
      dispatch({
        type: 'EXEC_ACTION',
        payload: {
          action: '',
        },
      });
    }
  }, [execAction]);

  useEffect(() => {
    if (setAction.action) {
      requestTextareaRef.current.value = setAction.action;
      if (setAction.serverResponse) {
        responseTextareaRef.current.value = setAction.serverResponse;
        setIsResponseFailed(true);
      } else {
        responseTextareaRef.current.value = '';
        setIsResponseFailed(false);
      }

      dispatch({
        type: 'SET_ACTION',
        payload: {
          action: '',
        },
      });
    }
  }, [setAction]);

  useEffect(() => {
    sendsayBridge.request({
      action: 'sys.storage.get',
      id: globalVariables.fieldWidthIDinStorage,
    })
      .then((data) => {
        firstFieldRef.current.style.width = `${wrapperRef.current.offsetWidth * data.obj.data.widthRatio}px`;
        firstFieldRef.current.style.flexGrow = 0;
      })
      .catch((err) => console.info('Error when fetch data', err));
  }, []);

  const checkHandler = useCallback((e) => {
    if (handlerRef.current.contains(e.target)) {
      setIsHandlerDragging(true);
    }
  }, []);

  const drag = useCallback((e) => {
    if (!isHandlerDragging) {
      return false;
    }
    const clientX = e.clientX ? e.clientX : e.touches[0].clientX;
    const containerOffsetLeft = wrapperRef.current.offsetLeft;

    const pointerRelativeXpos = clientX - containerOffsetLeft;

    const fieldMinWidth = 60;
    firstFieldRef.current.style.width = `${Math.max(fieldMinWidth, pointerRelativeXpos - 8)}px`;
    firstFieldRef.current.style.flexGrow = 0;
  }, [isHandlerDragging]);

  const stopDrag = useCallback(() => {
    setIsHandlerDragging(false);

    // Сохраняем соотношение ширины левого поля ввода к общей области
    sendsayBridge.request({
      action: 'sys.storage.set',
      id: globalVariables.fieldWidthIDinStorage,
      obj: {
        data: {
          widthRatio: firstFieldRef.current.offsetWidth / wrapperRef.current.offsetWidth,
        },
      },
      return_fresh_obj: 0,
    })
      .catch((err) => console.info('Error when set data in storage', err));
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', drag, { passive: false });
    window.addEventListener('touchmove', drag, { passive: false });
    window.addEventListener('mouseup', stopDrag, { passive: false });
    window.addEventListener('touchend', stopDrag, { passive: false });
    return () => {
      window.removeEventListener('mousemove', drag, { passive: false });
      window.removeEventListener('touchmove', drag, { passive: false });
      window.removeEventListener('mouseup', stopDrag, { passive: false });
      window.removeEventListener('touchend', stopDrag, { passive: false });
    };
  }, [drag]);

  return (
    <div className="Editor">
      <div className="Editor__wrapper" ref={wrapperRef}>
        <div className="Editor__field" ref={firstFieldRef}>
          <div
            className={classNames('Editor__title', (isRequestFailed && 'Editor__title--failed'))}
          >
            Запрос:
          </div>
          <textarea
            className={classNames('Editor__entry', (isRequestFailed && 'Editor__entry--failed'))}
            ref={requestTextareaRef}
            onChange={removeFailedBorder}
          />
        </div>
        <div
          className="Editor__drag"
          ref={handlerRef}
          onMouseDown={checkHandler}
          onMouseUp={stopDrag}
          onTouchStart={checkHandler}
          onTouchEnd={stopDrag}
        >
          <DragElement />
        </div>

        <div className="Editor__field">
          <div
            className={classNames('Editor__title', (isResponseFailed && 'Editor__title--failed'))}
          >
            Ответ:
          </div>
          <textarea
            disabled
            className={classNames('Editor__entry', (isResponseFailed && 'Editor__entry--failed'))}
            ref={responseTextareaRef}
          />
        </div>
      </div>

      <div className="Editor__footer">
        <div className="Editor__footerContent">
          <Button
            type="button"
            onClick={() => sendAction(requestTextareaRef.current.value)}
            isSending={isSending}
          >
            Отправить
          </Button>
          <a href="https://github.com/ToTheHit" className="Editor__github">@ToTheHit</a>
          <button
            type="button"
            className="Editor__format"
            onClick={() => {
              prettyPrint();
            }}
          >
            <AlignRight className="Editor__icon" />
            <span className="Editor__formatText">Форматировать</span>
          </button>
        </div>
      </div>
    </div>
  );
};

Editor.propTypes = {};
Editor.defaultProps = {};
export default Editor;
