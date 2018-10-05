window.onscroll = function() {scrollFunction()};

function scrollFunction() {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    document.getElementById("buttonScrollUp").style.display = "block";
  } else {
    document.getElementById("buttonScrollUp").style.display = "none";
  }
}

function goUp(){
    //window.scrollBy(0, -1);
}

function scrollUp() {
    window.scrollTo(0, 0);
    goUp();
    /*var i = 0;
    var max = document.documentElement.scrollTop;

    while(i < max) {
        goUp(i);
        i++;
    }*/
    
    document.getElementById("buttonScrollUp").style.display = "none";
}

function openInNewTab(url) {
    var win = window.open(url);
    win.focus();
  }