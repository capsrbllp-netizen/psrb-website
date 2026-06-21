document.addEventListener('DOMContentLoaded', function () {
  var toggle = document.querySelector('.menu-toggle');
  var links = document.querySelector('nav.links');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      links.classList.toggle('open');
    });
  }

  var dropdownToggle = document.querySelector('.dropdown .has-dropdown');
  var dropdown = document.querySelector('.dropdown');
  if (dropdownToggle && dropdown) {
    dropdownToggle.addEventListener('click', function (e) {
      if (window.innerWidth <= 900) {
        e.preventDefault();
        dropdown.classList.toggle('open');
      }
    });
  }
});
