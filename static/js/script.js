// Add click event listeners for the service cards
document.querySelectorAll('.service-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      // This will be replaced with actual navigation logic later
      console.log('Navigating to:', e.target.textContent);
    });
  });
  
  // Add click event listener for the login button
  document.querySelector('.login-btn').addEventListener('click', () => {
    // This will be replaced with actual login logic later
    console.log('Login clicked');
  });

  // chatbot 
  let context = "";

function openForm() {
    document.getElementById("myForm").style.display = "block";
}

function closeForm() {
    document.getElementById("myForm").style.display = "none";
}

async function sendMessage(event) {
event.preventDefault();
let message = document.getElementById("message").value;
let messagesDiv = document.getElementById("messages");

messagesDiv.innerHTML += `<p class='user'><b>You:</b> ${message}</p>`;
document.getElementById("message").value = "";

let response = await fetch("http://localhost:8000/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question: message, context: context })
});

let data = await response.json();
context = data.updated_context;

if (data.answer.includes("Patient Details:")) {
    messagesDiv.innerHTML += `<p class='bot'><b>Bot:</b><br><pre>${data.answer.replace(/\n/g, '<br>')}</pre></p>`;
} else {
    messagesDiv.innerHTML += `<p class='bot'><b>Bot:</b> ${data.answer}</p>`;
}
}