export async function getVerificationSession(tokenRequest, backendService) {
    const { verification_id } = tokenRequest;
  
    const url = `${backendService}/${verification_id}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
  
    return await response.json();
  }
  