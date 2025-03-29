// api-client.js
async function fetchUserData(token) {
    const response = await fetch('/api/user', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.json();
  }
  
  async function updateProfile(userData) {
    const token = getToken();
    const response = await fetch('/api/user', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    });
    return response.json();
  }
  
  async function sendMessage(conversationId, message) {
    const token = getToken();
    const response = await fetch(`/api/messages/${conversationId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message })
    });
    return response.json();
  }