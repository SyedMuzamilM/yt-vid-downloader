const URLInput = document.querySelector("#URL-input")
const quality = document.querySelector("#quality")
const extension = document.querySelector("#extension")
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

function getSelectedExtension(extension) {
  let opt;
  for (let i = 0, len = extension.options.length; i < len; i++) {
    opt = extension.options[i]

    if (opt.selected === true) {
      break
    }
  }
  return opt
}

submitBtn.addEventListener('click', () => {
    const URLValue = URLInput.value;
    const opt = getSelectedOption(quality);
    const ext = getSelectedExtension(extension);
   

    send(URLValue, opt.value, ext.value)
})

function send(URL, quality, extension) {
  window.location.href = `/download/video?URL=${URL}&q=${quality}&ext=${extension}`
}