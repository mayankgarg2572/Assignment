import React, { useState, useRef } from 'react';
import "./formstyle.css";
import html2canvas from 'html2canvas';
import './formstyle.css';

const Form = () => {
  const [inpts, setInpts] = useState(Array(10).fill(''));
  const [imgLinks, setImgLinks] = useState(Array(10).fill(''));
  const [isLoading, setIsLoading] = useState(2);
  const [shareImage, setShareImage] = useState(null);
  const imagePanelRef = useRef(null);
  const query = async (data, index) => {
    try {
      const response = await fetch(
        "https://xdwvg9no7pefghrn.us-east-1.aws.endpoints.huggingface.cloud",
        {
          headers: {
            "Accept": "image/png",
            "Authorization": "Bearer VknySbLLTUjbxXAXCjyfaFIPwUTCeRXbFSOjwRiCxsxFyhbnGjSFalPKrpvvDAaPVzWEevPljilLVDBiTzfIbWFdxOkYJxnOPoHhkkVGzAknaOulWggusSFewzpqsNWM",
            "Content-Type": "application/json"
          },
          method: "POST",
          body: JSON.stringify(data),
        }
      );

      // Check if the request was successful (status code 200)
      if (response.ok) {
        // console.log(response.body)
        
        // const newStream = new ReadableStream();
        // (response.body).pipeTo(newStream);
        // const reader = newStream.getReader();
        // const data = await reader.read();
        // const url = new URL(data);
        // console.log(url)
        const blob = await response.blob();

        // Convert the blob to a data URL
        const imgLink = URL.createObjectURL(blob);
         
        // Update the state with the image URL for the corresponding textbox
        setImgLinks((prevImageUrls) => {
          const newImageUrls = [...prevImageUrls];
          newImageUrls[index] = imgLink;
          return newImageUrls;
        });

      } else {
        console.error(`Rate Limit Reached Please wait for some time  ${index}`);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  const handleCopyToClipboard = (url) => {
    navigator.clipboard.writeText(url).then(
      function () {
        console.log('Image URL copied to clipboard successfully!');
      },
      function (err) {
        console.error('Unable to copy image URL to clipboard', err);
      }
    );
  };

  const handleCaptureImage = () => {
    if (imagePanelRef.current) {
      html2canvas(imagePanelRef.current).then((canvas) => {
        const dataUrl = canvas.toDataURL('image/png');
        setShareImage(dataUrl);
      });
    }
    else{
      console.log("imagePanelRef:", imagePanelRef)
    }
  };

  const handleShareByEmail = () => {
    if (shareImage) {
      const subject = 'Check out this image panel!';
      const body = `Check out the image panel I created using the React Form: ${shareImage}`;
      window.location.href = `mailto:?subject=${encodeURIComponent(
        subject
      )}&body=${encodeURIComponent(body)}`;
    }
    else{
      console.log("share Image:", shareImage)
    }
  };
  const handleSubmit = (e) => {
    setIsLoading(1);
    e.preventDefault();

    // Loop through each textbox value and call the query function
    inpts.forEach((value, index) => {
      query({ "inputs": value }, index);
    });

    // Simulate a delay (replace this with actual API request)
    setTimeout(() => {
      setIsLoading(0);
    }, 2000); // Adjust the delay as needed
  };

  return (
    <div className="form">
      

      {/* Form */}
      <div id="Formdiv">
      <h4>Please fill the form first:</h4>
      <form onSubmit={handleSubmit} id='form'>
        {inpts.map((value, index) => (
          <div key={index}>
              <input 
              required
              typeof='string'
              id={index.toString()}
              className='textbox'
                type="text"
                placeholder='Enter text to generate image'
                value={value}
                onChange={(e) => {
                  const newInputValues = [...inpts];
                  newInputValues[index] = e.target.value;
                  setInpts(newInputValues);
                }}
              />
            
          </div>
        ))}
        <button id='submitbutton' type="submit">Submit</button>
      </form></div>

      {/* Display Image Panel or Loading Message */}
      {isLoading === 2 && <div></div>}
      {isLoading === 1 && <div>Loading...</div>}
      {isLoading === 0 && (
        <div className='panel'>
          <h2>Image Panel</h2>
          <div ref={imagePanelRef} id='imgpanel'>
            {imgLinks.map((imgLink, index) => (
              <div key={index} id='imgdiv'>
                <button
                  onClick={() => handleCopyToClipboard(imgLink)}
                  className="copy-button"
                >
                  Copy URl
                </button>
                <img className='imgclass' src={imgLink} alt={`Preview ${index + 1}`}  />
              </div>
            ))}
          </div>
          <button onClick={handleCaptureImage} className="capture-button">
            Capture Image
          </button>
          {shareImage && (
            <button onClick={handleShareByEmail} className="share-button">
              Share via Email
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Form;
