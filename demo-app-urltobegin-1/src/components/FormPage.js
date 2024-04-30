import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.css";

const FormPage = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [email, setEmail] = useState("");
  const [verificationType, setVerification] = useState("");

  /**
   * Load the CLEAR Web SDK
   */
  const [clearUI, setClearUI] = useState(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://verified.clearme.com/clearme.js';
    script.async = true;
    script.onload = () => {
      // Once the script has loaded, access CLEAR and set it to state
      setClearUI(window.CLEAR);
    };
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  /**
   * This method generates a new verification_url. 
   * This can be used to navigate to build the link integration or it can be used to generate a new link
   * @returns verification_url 
   */
  const cvVerificationURL = async () => {
    //FORM Data
    localStorage.setItem("firstName", firstName);
    localStorage.setItem("lastName", lastName);
    localStorage.setItem("address", address);
    localStorage.setItem("city", city);
    localStorage.setItem("zipCode", zipCode);
    localStorage.setItem("email", email);

    var integrationType = 'link'
    const sessionEndpoint = `http://localhost:3002/getVerifySession?verificationType=${verificationType}&integrationType=${integrationType}`;
    
    try {
      const response = await fetch(sessionEndpoint);
      if (response.ok) {
        const data = await response.json();
        console.log("Create Verification Session Response:", data);
        console.log("Verification Session ID: " + data.id);

        localStorage.setItem("verification_id: ",data.id)
        let verification_token = data.token;
        console.log("verification_token " + verification_token);
        let verification_url = "https://verified.clearme.com/verify?token=" + verification_token;
        return verification_url;
      } else {
        // Handle error response
        console.error(
          "Failed to call CV API from React:",
          response.statusText
        );
      }
    } catch (error) {
      // Handle other errors
      console.error("Error during the fetch request:", error);
    }
  };
  
  /**
   * This method demos the Link SDK integration. 
   */
  const redirectToWebsite = async () => {
    const url = await cvVerificationURL();
    console.log('Navigating to: ' + url);
    window.location.href = url;
  };

  /**
   * This method demos the CLEAR Web SDK integration. 
   */
  const handleVerifyClick = () => {
    var integrationType = 'modal'
    const sessionEndpoint = `http://localhost:3002/getVerifySession?verificationType=${verificationType}&integrationType=${integrationType}`;

    localStorage.setItem("firstName", firstName);
    localStorage.setItem("lastName", lastName);
    localStorage.setItem("address", address);
    localStorage.setItem("city", city);
    localStorage.setItem("zipCode", zipCode);
    localStorage.setItem("email", email);

    // Check if clearUI is initialized before launching
    if (clearUI) {
      fetch(sessionEndpoint)
        .then(response => response.json())
        .then( data => {
          const token = data.token;
          const verification_id = data.id;
          console.log("clear token: " + token);
          localStorage.setItem('verification_id', verification_id);
          const clearUIInstance = clearUI.createUI(token, {
            onSuccess: (data) => {
              window.location.href = "/callback";
            },
            /**
             * For full list of events: https://docs.clearme.com/docs/web-sdk#onevent
             * @param {} data 
             */
            onEvent: (data) => {
                if(data.name === 'failed_verification_attempt') {
                  console.log('failed_verification_attempt...abort ' + JSON.stringify(data))
                  window.CLEAR.abort()
                }
                if(data.name === 'manual_review') {
                  console.log('manual_review...abort ' + JSON.stringify(data))
                  window.CLEAR.abort()
                }
                //console.log('onEvent: ' + JSON.stringify(data))
            },
            onExit: (data) => {
              console.log('Exited Modal: ' + data);
            }
          });
          clearUIInstance.launch();
        })
    }
  };

  const handleFirstNameChange = (e) => {
    setFirstName(e.target.value);
  };

  const handleLastNameChange = (e) => {
    setLastName(e.target.value);
  };

  const handleAddressChange = (e) => {
    setAddress(e.target.value);
  };

  const handleCityChange = (e) => {
    setCity(e.target.value);
  };

  const handleZipCodeChange = (e) => {
    setZipCode(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleVerificationChange = (e) => {
    setVerification(e.target.value);
  };

  return (
    <div className="container">
      <div className="customer-app">
        <div className="customer-app-banner">
          &#169;&nbsp; R-eally Fake Company
        </div>
        <form className="customer-app-form">
          <div className="mb-3">
            <label htmlFor="firstName" className="form-label">
              First Name:
            </label>
            <input
              type="text"
              className="form-control"
              id="firstName"
              name="firstName"
              value={firstName}
              onChange={handleFirstNameChange}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="lastName" className="form-label">
              Last Name:
            </label>
            <input
              type="text"
              className="form-control"
              id="lastName"
              name="lastName"
              value={lastName}
              onChange={handleLastNameChange}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="Address" className="form-label">
              Street Address:
            </label>
            <input
              className="form-control"
              id="address"
              name="address"
              value={address}
              onChange={handleAddressChange}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="city" className="form-label">
              City:
            </label>
            <input
              className="form-control"
              id="city"
              name="city"
              value={city}
              onChange={handleCityChange}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="zipCode" className="form-label">
              Zip Code:
            </label>
            <input
              className="form-control"
              id="zipCode"
              name="zipCode"
              value={zipCode}
              onChange={handleZipCodeChange}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email (Optional):
            </label>
            <input
              className="form-control"
              id="email"
              name="email"
              value={email}
              onChange={handleEmailChange}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="verificationType" className="form-label">
              Verification Type:
            </label>
            <select
              className="form-select"
              id="verificationType"
              name="verificationType"
              value={verificationType}
              onChange={handleVerificationChange}
              required
            >
              <option value="">Select Verification Type</option>
              <option value="kyc">Know Your Customer</option>
              <option value="document">Document Verification</option>
            </select>
          </div>

          <div className="mb-3">
              <button
                type="button"
                className="btn btn-primary"
                onClick={redirectToWebsite}
              >
                Verify using Link
              </button>
          </div>

          <div className="mb-3">
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleVerifyClick}
              >
                Verify using Web Modal SDK
              </button>
          </div>

        </form>
      </div>

      <div className="explain">
        <div className="title">Clear Verified DEMO</div>
        <div className="subtitle">
          This sample application provides an easy way to run the end-to-end{" "}
          <i>Powered by</i> CLEAR experience.
        </div>
        <ol>
          <li>Fill out the form with test info</li>
          <li>Click "Verify with CLEAR" to conduct a sample verification</li>
          <li>
            Compare results at the end: your self-attested info vs. info
            verified by CLEAR.
          </li>
        </ol>
        <div className="use-common-sense">
          <i>Note</i> - this app is for demo purposes only. All production,
          partner apps must pass a code review with our team. This protects
          customers, your company and CLEAR.
        </div>
      </div>
    </div>
  );
};

export default FormPage;
