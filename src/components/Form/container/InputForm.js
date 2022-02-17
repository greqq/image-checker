import React from 'react';
import { useState } from 'react';
import axios from 'axios';
import { trackPromise } from 'react-promise-tracker';
import InputFormComponent from '../components/InputForm';

function InputForm() {
  const [imageURL, setImageURL] = useState('');
  const [responseData, setResponseData] = useState('');
  const [errorData, setErrorData] = useState('');
  const [imageUpload, setImageUpload] = useState(null);

  const processResponseData = (data) => {
    let result = [];
    setResponseData('');
    setErrorData('');

    if (data.status === 'success') {
      // Drugs, alcohol, wepons. Treshold is set to 50%
      if (data.drugs >= 0.5) {
        //setTest(...testData,{drugs: true})
        result.push(
          'Šansa je ' + data.drugs * 100 + '% da je na slici prikazana droga!'
        );
      }
      if (data.alcohol >= 0.1) {
        result.push(
          'Šansa je ' +
            data.alcohol * 100 +
            '% da je na slici prikazan alkohol!'
        );
      }
      if (data.weapon >= 0.5) {
        result.push(
          'Šansa je ' +
            data.weapon * 100 +
            '% da je na slici prikazano oružije!'
        );
      }

      // nudity
      if (data.nudity.raw >= Math.max(data.nudity.partial, data.nudity.safe)) {
        // raw nudity
        result.push('Slika sadrži golotinju!');
      } else if (
        data.nudity.partial >= Math.max(data.nudity.raw, data.nudity.safe)
      ) {
        // partial nudity
        result.push('Slika sadrži djelomičnu golotinju!');
      } else {
        //no nudity
        //result.push({ nudity: false });
      }

      //offensive content
      if (data.offensive.prob >= 0.5) {
        result.push(
          'Šansa je ' +
            data.offensive.prob * 100 +
            '% da je na slici prikazan uvredljiv sadržaj!'
        );
      }

      // Graphic Violence & Gore Detection
      if (data.gore.prob >= 0.5) {
        result.push(
          'Šansa je ' +
            data.gore.prob * 100 +
            '% da je na slici prikazano grafičko nasilje ili krvoproliće!'
        );
      }

      // Minor -> younger then 18
      for (const face of data.faces) {
        if (face.attributes.minor >= 0.5) {
          result.push(
            'Šansa je ' +
              face.attributes.minor * 100 +
              '% da je na slici prikazana osoba mlađa od 18 godina!'
          );
          break;
        }
      }
      setResponseData(result);
    }
  };

  const processError = (err, urlbool) => {
    setErrorData('');

    if (urlbool) {
      if (err.response) {
        setErrorData(
          'Nije moguće preuzeti medij. URL koji koristite ima loš/nezakonit format ili nedostaje URL. Provjerite je li URL medija ispravan.'
        );
      } else {
        setErrorData(err.message + '. Pokušajte ponovno!');
      }
    } else {
      if (err.response) {
        setErrorData(err.response.data);
      } else {
        setErrorData(err.message + '. Pokušajte ponovno!');
      }
    }
  };

  const handleImageUrl = (e) => {
    setResponseData('');
    setImageURL(e.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setResponseData('');

    trackPromise(
      axios
        .get('https://api.sightengine.com/1.0/check.json', {
          params: {
            url: imageURL,
            models: 'nudity,wad,offensive,face-attributes,gore',
            api_user: process.env.REACT_APP_API_USER,
            api_secret: process.env.REACT_APP_API_SECRET,
          },
        })
        .then(function (response) {
          // on success: handle response
          processResponseData(response.data);
        })
        .catch(function (error) {
          // handle error
          if (error.response) console.log(error.response.data);
          else console.log(error.message);
          processError(error, true);
        })
    );
  };

  const handleFileRead = (e) => {
    setResponseData('');

    if (e.target.files[0]) {
      const reader = new FileReader();
      reader.readAsDataURL(e.target.files[0]);

      reader.onload = (readerEvent) => {
        setImageUpload(readerEvent.target.result);
      };

      const data = new FormData();
      data.append('media', e.target.files[0]);
      data.append('models', 'nudity,wad,offensive,face-attributes,gore');
      data.append('api_user', process.env.REACT_APP_API_USER);
      data.append('api_secret', process.env.REACT_APP_API_SECRET);

      trackPromise(
        axios({
          method: 'post',
          url: 'https://api.sightengine.com/1.0/check.json',
          data: data,
          headers: { 'content-type': 'multipart/form-data' },
        })
          .then(function (response) {
            // on success: handle response
            processResponseData(response.data);
          })
          .catch(function (error) {
            // handle error
            setErrorData(error, false);
          })
      );
    }
  };

  return (
    <>
      <InputFormComponent
        imageURL={imageURL}
        responseData={responseData}
        handleImageUrl={handleImageUrl}
        handleSubmit={handleSubmit}
        handleFileRead={handleFileRead}
        imageUpload={imageUpload}
        errorData={errorData}
      />
    </>
  );
}

export default InputForm;
