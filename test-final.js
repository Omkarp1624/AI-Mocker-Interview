// PASTE YOUR ACTUAL API KEY HERE
const apiKey = "AIzaSyADfumnPJ6ipNBx-ijsf0eUBvVnpkyvUBc";

async function testKey() {
  console.log('Testing API key with v1beta...\n');
  
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: "Say hello in one word" }] }]
        })
      }
    );

    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ API KEY WORKS!');
      console.log('Response:', data.candidates[0].content.parts[0].text);
    } else {
      console.log('❌ API KEY FAILED!');
      console.error('Error:', data);
    }
  } catch (error) {
    console.log('❌ ERROR:', error.message);
  }
}

testKey();
