import React from 'react';

function ResponseError({ errorData }) {
  return (
    <div>
      <p>{errorData}</p>
    </div>
  );
}

export default ResponseError;
