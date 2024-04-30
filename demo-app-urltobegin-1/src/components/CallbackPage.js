import React, { useEffect, useState } from "react";
import { getVerificationSession } from "../services/DataShareService";
import { useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";
import "../CardStyles.css";

/**
 * backendService is "/retrieveResults"
 */
const backendService = process.env.REACT_APP_BACKEND_SERVICE;

//TODO: Link to Verification Session
const CallbackPage = () => {
  const location = useLocation();
  const [responseValues, setResponseValues] = useState({});
  const [responseAddress, setresponseAddress] = useState({});
  const [responseChecks, setresponseChecks] = useState([]);

  useEffect(() => {
    const firstName = localStorage.getItem("firstName");
    const lastName = localStorage.getItem("lastName");
    const address = localStorage.getItem("address");
    const city = localStorage.getItem("city");
    const zipCode = localStorage.getItem("zipCode");
    const verification_id = localStorage.getItem("verification_id");

    const sessionRequest = {
      firstName,
      lastName,
      address,
      city,
      zipCode,
      verification_id,
    };

    getVerificationSession(sessionRequest, backendService)
      .then((response) => {
        console.log("response from CallbackPage:", response);
        //TODO: Traits instead of verified_info
        setResponseValues(response.traits || {});
        setresponseAddress(response.traits.address || {});
        setresponseChecks(response.checks || []);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, [location.search]);

  return (
    <div className="container">
      <div class="card mb-4">
        <h2 class="card-header bg-light-blue"> Member Data Comparison </h2>
        <div class="card-body">
          <h5 class="card-title">
            Verify the input data with CLEAR Verified Data
          </h5>
          <p class="card-text">
            <table className="table">
              <thead>
                <tr>
                  <th></th>
                  <th>Member Entered</th>
                  <th>CLEAR Response</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>First Name</td>
                  <td>{localStorage.getItem("firstName")}</td>
                  <td>{responseValues.first_name}</td>
                </tr>
                <tr>
                  <td>Last Name</td>
                  <td>{localStorage.getItem("lastName")}</td>
                  <td>{responseValues.last_name}</td>
                </tr>
                <tr>
                  <td>Street Address</td>
                  <td>{localStorage.getItem("address")}</td>
                  <td>{responseAddress.line1}</td>
                </tr>
                <tr>
                  <td>City</td>
                  <td>{localStorage.getItem("city")}</td>
                  <td>{responseAddress.city}</td>
                </tr>
                <tr>
                  <td>Zip Code</td>
                  <td>{localStorage.getItem("zipCode")}</td>
                  <td>{responseAddress.postal_code}</td>
                </tr>
              </tbody>
            </table>
          </p>
        </div>
      </div>

      <div class="card mb-4">
        <h2 class="card-header bg-light-blue">Verification Checks</h2>
        <div class="card-body">
          <h5 class="card-title">
            See what checks ran during the verification process
          </h5>
          <p class="card-text">
            <table className="table">
              <thead>
                <tr>
                  <th>Check</th>
                  <th>Value</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {responseChecks.map((check, index) => {
                  // console.log("Current check:", check); // Log the current check
                  return (
                    <tr key={index}>
                      <td>{check.name}</td>
                      <td>{check.value === true ? "Passed" : (check.value !== undefined ? check.value : "N/A")}</td>
                      <td>{check.status}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </p>
        </div>
      </div>
    </div>
  );
};

export default CallbackPage;
