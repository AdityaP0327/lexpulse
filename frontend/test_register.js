fetch('http://localhost:5000/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        businessName: 'Test Corp', 
        email: 'test2@example.com', 
        password: 'password123', 
        industry: 'service', 
        msmeType: 'micro'
    })
}).then(res => res.text()).then(text => console.log("RESPONSE:", text)).catch(err => console.error("ERROR:", err));
