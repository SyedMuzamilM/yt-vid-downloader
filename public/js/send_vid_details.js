const quality = document.querySelector('#quality');
const submitBtn = document.querySelector('#submit');
const t = document.querySelector('#title').innerText;

const id = document.querySelector('#image').getAttribute('alt');

// const title = t.replace('/\s/g ', '-')
const title = t.split(' ').join('_')


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
    // console.log(title)
    send(vid_id, q, title);
})

function send(vid_id, q, title) {
    window.location.href = `/download/video?id=${vid_id}&q=${q}&title=${title}`
}