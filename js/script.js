const $ = jQuery
let downloadBtn = $('#download-btn')
let loadingIcon = $('.loading')
let downloadIcon = $('.fa-download')

const toggleLoadingState = () => {
    loadingIcon.toggle()
    downloadIcon.toggle()
    document.querySelector('#download-btn').toggleAttribute('disabled')
}

const getVideoInfo = () => {

    toggleLoadingState()

    let url = $('#url-input').val()

    $.post('https://download-anything.onrender.com/get-video-info', { url }).then(({ videos, audios, videoDetails }) => {

        $('#error-section').hide()
        toggleLoadingState()

        $('#video-download').addClass('show')

        $('#video-title').html(videoDetails.title)

        let { thumbnails } = videoDetails
        let thumbnail = thumbnails[thumbnails.length - 1].url
        $('#video-download .img-box').css('background-image', `url(${thumbnail})`)

        $('#video-download .formats-box .quality-btn').remove()
        videos.forEach(video => {
            $('#video-download .formats-box').append(`
        <a href="${video.url}" class="quality-btn" download target="_blank">
          <i class="fa-solid fa-photo-film"></i>
          ${video.qualityLabel}
        </a>
      `)
        })

        if (audios) {
            $('#video-download .formats-box').append(`
        <a href="${audios[0].url}" class="quality-btn" download target="_blank">
          <i class="fa-solid fa-music"></i>
          Audio
        </a>
      `)
        }

    }).catch(err => {
        console.log(err)
        if (err.status == 404) {
            $('#video-download').removeClass('show')
            $('#error-section').show()
            toggleLoadingState()
        }
    })
}

downloadBtn.on('click', () => {
    getVideoInfo()
})

let clearBtn = $('#clear-btn')
let input = $('#url-input')

input.on('input', e => {
    if (input.val()) {
        clearBtn.show()
    }
    else {
        clearBtn.hide()
    }
})

input.on('keypress', e => {
    if (e.which == 13) {
        getVideoInfo()
    }
})

clearBtn.on('click', e => {
    input.val('')
    clearBtn.hide()
})
