import React from 'react';
import PropTypes from 'prop-types';
import './logo.css';

const Logo = (props) => {
  const { className } = props;
  return (
    <div className={`Logo ${className}`}>
      <div className="Logo__circle" />
      <div className="Logo__rectangle" />
      <div className="Logo__circle" />
      <div className="Logo__rectangle Logo__rectangle--skew" />
    </div>
  );
};

Logo.propTypes = {
  className: PropTypes.string,
};
Logo.defaultProps = {
  className: '',
};
export default Logo;
