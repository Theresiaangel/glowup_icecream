document.getElementById('contactForm').addEventListener('submit',async function(e) {
e.preventDefault();

const form = e.target;
const data = new URLSearchParams(new FormData(form));

const response = await fetch('/contacts', {
    method: 'POST',
    body: data,
    hearders: { 'Content-Type': 'application/x-www-form-urlencoded'}
});

const text = await response.text();
document.getElementById('responseMsg').textContent = text;
form.reset();
})