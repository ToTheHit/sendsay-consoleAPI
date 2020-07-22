import React from 'react';
import PropTypes from 'prop-types';
import './button.css';
import Spinner from '../../../assets/Auth/Spinner2.svg';
import classNames from '../../../lib/classNames';

const Button = (props) => {
  const {
    onClick, isSending, isDisabled, className, children,
  } = props;
  return (
    <button
      type="button"
      className={classNames('Button', className)}
      onClick={() => onClick()}
      disabled={isDisabled}
    >
      {isSending ? <Spinner /> : children}
    </button>
  );
};

Button.propTypes = {
  onClick: PropTypes.func,
  isSending: PropTypes.bool,
  isDisabled: PropTypes.bool,
  className: PropTypes.string,
  children: PropTypes.string,
};
Button.defaultProps = {
  onClick: () => {},
  isSending: false,
  isDisabled: false,
  className: '',
  children: '',
};
export default Button;
