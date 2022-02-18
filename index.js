/* NAVIGATION */
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


/* SCROLL TO TOP BUTTON */
const topButton = document.getElementById("top_button");

window.onscroll = function() {scrollFunction()};

function scrollFunction() {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    topButton.style.display = "block";
  } else {
    topButton.style.display = "none";
  }
}

function topFunction() {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}

/* LOADER */
const load = document.querySelector('.load');
const main = document.querySelector('.main');

function init() {
  setTimeout(() => {
    load.style.opacity = 0;
    load.style.display = 'none';

    main.style.display = 'block';
    setTimeout(() => (main.style.opacity = 1), 50);
  }, 3000);
}

init();