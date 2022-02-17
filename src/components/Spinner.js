import React from 'react';
import { usePromiseTracker } from 'react-promise-tracker';
import { ThreeDots } from 'react-loader-spinner';

function Spinner() {
  const { promiseInProgress } = usePromiseTracker();
  return (
    promiseInProgress && (
      <div className='Spinner'>
        <ThreeDots color='#00000' height='50' width='50' />
      </div>
    )
  );
}

export default Spinner;
