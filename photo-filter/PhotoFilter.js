class PhotoFilter {
    constructor() {
        this.filters = document.querySelector('.filters');
        this.btns = document.querySelector('.btn-container');
        this.fullScreen = document.querySelector('.fullscreen');
        this.img = document.querySelector('img');
        this.fileInput = document.querySelector('input[name="upload"]');
        this.filtersValue = {};
    }

    init() {
        this.filters.addEventListener('input', this.onInput);
        this.btns.addEventListener('click', this.onBtnsClick);
        this.fullScreen.addEventListener('click', clickFullScreen);
        this.fileInput.addEventListener('change', this.loadImg);
    }

    onInput = (e) => {
        const filter = e.target;
        const output = filter.nextElementSibling;
        const value = filter.value;
        const measure = filter.dataset.sizing;
        output.value = value;
        this.img.style.setProperty(`--${filter.name}`, `${value}${measure}`);
        this.filtersValue[filter.name] = `${value}${measure}`;
    }

    onBtnsClick = (e) => {
        const btnClasses = e.target.classList;
        if (btnClasses.contains('btn-reset')) {
            this.resetStyles();
        }
        if (btnClasses.contains('btn-next')) {
            this.getNextImg();
        }
        if (btnClasses.contains('btn-save')) {
            this.saveImg();
        }
    };

    resetStyles() {
        let ranges = this.filters.children;
        ranges = Array.prototype.slice.call(ranges);
        ranges.forEach((el) => {
            const input = el.firstElementChild;
            const output = el.lastElementChild;
            if (input.name === 'saturate') {
                this.img.style.setProperty(`--${input.name}`, `100${input.dataset.sizing}`);
                input.value = 100;
                output.value = 100;
            } else {
                this.img.style.setProperty(`--${input.name}`, `0${input.dataset.sizing}`);
                input.value = 0;
                output.value = 0;
            }
            this.filtersValue = {};
        });
    }

    getNextImg = () => {
        const next = new Image();
        next.src = createImgUrl();
        next.onload = () => this.img.src = next.src;
    };

    loadImg = () => {
        const file = this.fileInput.files[0];
        const reader = new FileReader();
        reader.onload = () => {
            const loadedFile = new Image();
            loadedFile.src = reader.result;
            this.img.src = loadedFile.src;
        }
        reader.readAsDataURL(file);
    };

    addFiltersToCanvas() {
        let filterString = '';
        for (let value in this.filtersValue) {
            filterString += `${value}(${this.filtersValue[value]}) `;
        }
        return filterString.trim();
    };

    saveImg() {
        const canvas = document.querySelector('canvas');
        const img = new Image();
        img.setAttribute('crossOrigin', 'anonymous');
        img.src = this.img.src;
        img.onload =  () => {
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext("2d");
            ctx.filter = this.addFiltersToCanvas();
            ctx.drawImage(img, 0, 0);
            createSaveLink(canvas);
        }
    }

}

const createSaveLink = (canvas) => {
    const link = document.createElement('a');
    link.download = 'download.jpeg';
    link.href = canvas.toDataURL('image/jpeg');
    link.click();
    link.delete;
};

const onFullScreen = (e) => {
};

let imgNum = 1;
const createImgUrl = () => {
    const date = new Date();
    const hour = date.getHours();
    let dayTime = '';
    if (hour > 17) {
        dayTime = 'evening';
    } else if (hour > 11) {
        dayTime = 'day';
    } else if (hour > 5) {
        dayTime = 'morning';
    } else {
        dayTime = 'night';
    }
    if (imgNum === 20) imgNum = 0;
    imgNum++;
    return `https://raw.githubusercontent.com/rolling-scopes-school/stage1-tasks/assets/images/${dayTime}/${imgNum.toString().padStart(2, '0')}.jpg`;
};

let fullScreenClicked = false;
function clickFullScreen() {
    if (!fullScreenClicked) {
        activateFullscreen();
        fullScreenClicked = true;
    } else {
        deactivateFullscreen();
        fullScreenClicked = false;
    }
}

function activateFullscreen() {
    if (document.body.requestFullscreen) {
        document.body.requestFullscreen();        // W3C spec
    }
    else if (document.body.mozRequestFullScreen) {
        document.body.mozRequestFullScreen();     // Firefox
    }
    else if (document.body.webkitRequestFullscreen) {
        document.body.webkitRequestFullscreen();  // Safari
    }
    else if (document.body.msRequestFullscreen) {
        document.body.msRequestFullscreen();      // IE/Edge
    }
};

function deactivateFullscreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    }
};

const photoFilter = new PhotoFilter();
photoFilter.init();