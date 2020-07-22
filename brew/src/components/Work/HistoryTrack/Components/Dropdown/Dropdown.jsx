import React, {
  useCallback, useEffect, useRef, useState,
} from 'react';
import './dropdown.css';
import { useDispatch, useSelector } from 'react-redux';
import classNames from '../../../../../lib/classNames';

const Dropdown = () => {
  const dropdownData = useSelector((state) => state.dropdownData);
  const userInfo = useSelector((state) => state.userInfo);

  const dispatch = useDispatch();
  const dropdownRef = useRef(null);
  const [isReversed, setIsReversed] = useState(false);

  const closeDropdown = useCallback(() => {
    if (dropdownData.isOpen) {
      dispatch({
        type: 'TOGGLE_DROPDOWN',
        payload: {
          isOpen: false,
        },
      });
    }
  }, [dropdownData.isOpen]);

  useEffect(() => {
    window.addEventListener('click', closeDropdown, { passive: false });
    return () => {
      window.removeEventListener('click', closeDropdown, { passive: false });
    };
  }, [closeDropdown]);

  useEffect(() => {
    if (dropdownData.isOpen) {
      if (dropdownData.y + 150 > window.innerHeight) {
        setIsReversed(true);
      } else {
        setIsReversed(false);
      }

      // Проверка на левую и правую границы, чтобы дропдаун не выходил за пределы окна
      if (dropdownRef.current.getBoundingClientRect().x < 15) {
        dispatch({
          type: 'TOGGLE_DROPDOWN',
          payload: {
            x: 15,
          },
        });
      }
      if (dropdownRef.current.getBoundingClientRect().right + 15 > window.innerWidth) {
        dispatch({
          type: 'TOGGLE_DROPDOWN',
          payload: {
            x: window.innerWidth - 50 - 133,
          },
        });
      }
    }
  }, [dropdownData]);

  function textToClipboard(text) {
    const dummy = document.createElement('textarea');
    document.body.appendChild(dummy);
    dummy.value = text;
    dummy.select();
    document.execCommand('copy');
    document.body.removeChild(dummy);
    dispatch({
      type: 'COPY_ACTION',
      payload: {
        id: dropdownData.id,
      },
    });
  }

  function deleteAction() {
    const temp = userInfo.actions;
    for (let i = 0; i < temp.length; i += 1) {
      if (temp[i].id === dropdownData.id) {
        temp.splice(i, 1);
        break;
      }
    }

    dispatch({
      type: 'UPDATE_USER_INFO',
      payload: {
        actions: temp,
      },
    });
  }

  function execAction() {
    dispatch({
      type: 'EXEC_ACTION',
      payload: {
        action: dropdownData.content,
      },
    });
  }

  return (
    <div
      className={
        classNames('Dropdown',
          (!dropdownData.isOpen && 'Dropdown--hidden'),
          (isReversed && 'Dropdown--reversed'))
      }
      style={{ left: `${dropdownData.x}px`, top: `${dropdownData.y}px` }}
      ref={dropdownRef}
    >
      <div className="Dropdown__item" onClick={execAction}>Выполнить</div>
      <div className="Dropdown__item" onClick={() => textToClipboard(dropdownData.content)}>
        Скопировать
      </div>
      <div
        className={classNames(
          'Dropdown__item Dropdown__item--delete',
          (isReversed && 'Dropdown__item--reversed'
          ),
        )}
        onClick={deleteAction}
      >
        Удалить
      </div>
    </div>
  );
};

Dropdown.propTypes = {};
Dropdown.defaultProps = {};
export default Dropdown;
