import ResponseError from './ResponseError';
import ResponseOutput from './ResponseOutput';
import { usePromiseTracker } from 'react-promise-tracker';

function InputFormComponent({
  imageURL,
  responseData,
  handleImageUrl,
  handleSubmit,
  handleFileRead,
  imageUpload,
  errorData,
}) {
  const { promiseInProgress } = usePromiseTracker();

  return (
    <div>
      <div>
        <form onSubmit={handleSubmit}>
          <input type='text' value={imageURL} onChange={handleImageUrl} />
          <input type='submit' />
        </form>
        <input onChange={handleFileRead} type='file' accept='image/*' />
      </div>

      {responseData && (
        <ResponseOutput
          imageUpload={imageUpload}
          imageURL={imageURL}
          responseData={responseData}
        />
      )}

      {errorData && <ResponseError errorData={errorData} />}
    </div>
  );
}

export default InputFormComponent;
