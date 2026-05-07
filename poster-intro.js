const titleScreen = document.getElementById('title-screen');

if (titleScreen) {
    const hideTitleScreen = () => {
        titleScreen.classList.add('is-fading');
    };

    titleScreen.addEventListener('transitionend', () => {
        titleScreen.remove();
        document.body.classList.remove('intro-active');
    }, { once: true });

    setTimeout(hideTitleScreen, 4300);
}
