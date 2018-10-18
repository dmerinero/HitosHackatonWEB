window.onscroll = function () { scrollFunction() };

function scrollFunction() {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    document.getElementById("buttonScrollUp").style.display = "block";
  } else {
    document.getElementById("buttonScrollUp").style.display = "none";
  }
}

function scrollUp() {
  window.scrollTo(0, 0);
  document.getElementById("buttonScrollUp").style.display = "none";
}

function openInNewTab(url) {
  var win = window.open(url);
  win.focus();
}

document.addEventListener("DOMContentLoaded", function () {
  getStars();
});

function getStars() {
  loadJSON('https://api.github.com/repos/dmerinero/HitosHackatonWEB',
    function (data) { console.log(data); },
    function (xhr) { console.error(xhr); }
  );
}

function loadJSON(path, success, error) {
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function () {
    document.getElementById("starsLoader").classList.remove(["hidden"]);

    if (xhr.readyState === XMLHttpRequest.DONE) {
      if (xhr.status === 200) {
        if (success) {
          var myParsed = JSON.parse(xhr.responseText);
          showStars(myParsed.stargazers_count);
        }
      } else {
        if (error) {
          error(xhr);
          showStars("?");
        }
      }

      document.getElementById("starsLoader").classList.add(["hidden"]);
    }
  };

  xhr.open("GET", path, true);
  xhr.send();
}

function showStars(count) {
  document.getElementById("starsNumber").innerHTML = count;
  document.getElementById("stars").classList.remove(["hidden"]);
}