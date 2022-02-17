import React from 'react';

function ResponseOutput({ imageUpload, imageURL, responseData }) {
  return (
    <div>
      <img src={imageUpload || imageURL} height='200' alt='' />
      <ul>
        {responseData.map((item, i) => (
          <li key={i}>{item} </li>
        ))}
      </ul>
    </div>
  );
}

export default ResponseOutput;
