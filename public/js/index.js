const URLInput = document.querySelector("#URL-input")
const submitBtn = document.querySelector(".submit")

submitBtn.addEventListener('click', () => {
    const URLValue = URLInput.value;

    send(URLValue)
    URLValue.value = '';
})

function send(URL) {
  window.location.href = `/download/search/video?URL=${URL}`
}