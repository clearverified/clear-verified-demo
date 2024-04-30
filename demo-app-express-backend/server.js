const express = require("express");
const app = express();
const axios = require("axios");
const cors = require("cors");

app.use(cors());
app.use(express.json());

const port = 3002;
const API_KEY = process.env.API_KEY;
const PROJECT_ID_KYC = process.env.PROJECT_ID_KYC;
const PROJECT_ID_DOC = process.env.PROJECT_ID_DOC;
const REDIRECT_URL = process.env.REACT_APP_REDIRECT_URI;
const VERIFIED_API_URL = process.env.VERIFIED_API_URL;

/**
 * API Call in order to get a new Verification Session
 * Returns the whole JSON from the Clear Verified API
 */
app.get('/getVerifySession', async (req, res) => {
  try {
    const { verificationType, integrationType } = req.query;

    let project_id = verificationType === 'kyc' ? PROJECT_ID_KYC : PROJECT_ID_DOC;
    console.log(`generating a ${verificationType.toUpperCase()} Verification Session from: ${PROJECT_ID_KYC}`)
    
   /**
   * Make sure you define the redirectURI here for link integration
   * Web Modal SDK can handle without redirectURI
   */
    const response = await createVerificationSession(project_id, integrationType);

    console.log('/getVerifySession: '+JSON.stringify(response, null, 2))
    res.json(response);
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Failed to call CV API' });
  }
});

async function createVerificationSession(project_id, integrationType) {

  let body = {project_id};
  if(integrationType === "link"){
    console.log(`defining redirectURI for link integration: ${REDIRECT_URL}`);
    body["redirect_url"] = REDIRECT_URL;
  }

  const response = await axios.post(VERIFIED_API_URL, body, {

    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json'
    }
  });
  return response.data;

}

/**
 * Retreives the Verification Result and 
 * @returns response.data
 */
async function retrieveVerificationSession(verification_id) {
  try {
    console.log(`retrieveVerificationSession: ${VERIFIED_API_URL}/${verification_id}`);

    const response = await axios.get(VERIFIED_API_URL+"/"+verification_id, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    verification_id = response.data
    return response.data;
  } catch (error) {
    console.error('Error calling Clear Verified API:', error);
    throw error;
  }
}

app.get('/retrieveResults/:id', async (req, res) => {
  const MAX_RETRIES = 3;
  const RETRY_DELAY = 500;
  let retries = 0;

  const { id } = req.params;

  // can we make this cleaner?
  while (retries < MAX_RETRIES) {
    try {
      const response = await retrieveVerificationSession(id);

    if (response.status && response.status === 'success')
    {
        res.json(response);
        console.log('/Results: '+JSON.stringify(response, null, 2));
        return; 
      } else {
        retries++;
        console.log('Retrieve not successful....trying again');
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY)); 
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }

  // If retries are exhausted, respond with error
  res.status(500).json({ error: 'Failed to retrieve results after multiple attempts' });
});

/**
 * Retreives the Verification Result and 
 * @returns response.data
 */
async function retrieveVerificationSession(verification_id) {
  console.log(`async function retrieveVerificationSession: ${VERIFIED_API_URL}/${verification_id}`);

  const headers = {
    'Authorization': `Bearer ${API_KEY}`,
    'Content-Type': 'application/json'
  };
  // try changing {headers} -> headers, and see if it works
  const response = await axios.get(`${VERIFIED_API_URL}/${verification_id}`, { headers });
  return response.data;
}

app.listen(port, () => {
  console.log(`Express server is running on port ${port}`);
});
