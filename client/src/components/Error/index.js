import React from 'react';

const ErrorMessage = ({ error }) => (
  <div>
    <small>{error.message}</small>
  </div>
);

export default ErrorMessage;
