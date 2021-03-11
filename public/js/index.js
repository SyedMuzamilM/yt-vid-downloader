const URLInput = document.querySelector("#URL-input")
const quality = document.querySelector("#quality")
const submitBtn = document.querySelector(".submit")

function getSelectedOption(quality) {
  let opt;
  for (let i = 0, len = quality.options.length; i < len; i++) {
    opt = quality.options[i]

    if (opt.selected === true) {
      break
    }
  }
  return opt
}

submitBtn.addEventListener('click', () => {
    const URLValue = URLInput.value
    const opt = getSelectedOption(quality);
   
    console.log(URLValue)
    console.log("option value: ", opt.value)
    // console.log(typeof(opt.value), typeof(Number(opt.value)))

    send(URLValue, Number(opt.value))
})

function send(URL, quality) {
  window.location.href = `/download/video?URL=${URL}&q=${quality}`
}