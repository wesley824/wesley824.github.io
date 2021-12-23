const navToggle = document.querySelector('.nav_toggle');
const navLinks = document.querySelectorAll('.nav_link')

navToggle.addEventListener('click', () => {
    document.body.classList.toggle('nav_open')
});

navLinks.forEach(Link => {
    Link.addEventListener('click', () => {
        document.body.classList.remove('nav_open');
    })
})