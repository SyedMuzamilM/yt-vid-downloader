const quality = document.querySelector('#quality');
const submitBtn = document.querySelector('#submit');

const id = document.querySelector('#image').getAttribute('alt');

function getSelectedQuality(quality) {
    let output;
    for(let i = 0, len = quality.options.length; i < len; i++) {
        output = quality.options[i];

        if (output.selected === true){
            break
        }
    }
    return output
}

submitBtn.addEventListener('click', () => {
    const vid_id = id;
    const q = getSelectedQuality(quality).value

    send(vid_id, q);
})

function send(vid_id, q) {
    window.location.href = `/download/video?id=${vid_id}&q=${q}`
}