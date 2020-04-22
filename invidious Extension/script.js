/*
 Look at all links in the current page and, if any of them references a YouTube video, install a
 click event handler that redirects to the corresponding video on ividio.us.
 
 Author: Francesco Pierfederici <me@pythoninside.com>
 
 Thanks to https://github.com/mperez01/no-youtube for inspiration
 */
function deYouTubifyLinks(event) {
    // Change here if you host your own invidiuos instance or want another instance
    var invidiousURL = "https://www.invidio.us"
    
    // Do not change anything below unless you know what you are doing ;-)
    var longURL = "youtube.com";
    var shortURL = "youtu.be";
    var currentLocation = window.location.href;

    var anchors = document.getElementsByTagName("a");
    for (var i = 0; i < anchors.length; i++) {
        if(anchors[i].href.includes(longURL) || anchors[i].href.includes(shortURL)) {
            anchors[i].addEventListener("click", function(event) {
                event.preventDefault();

                var target = this.target;
                if (event.ctrlKey || event.metaKey) {
                    target = "_blank";
                }
                if(!target) {
                  target = "_self";
                }

                var url = new URL(this.href);
                var sanitizedUrl;
                if(this.href.includes(longURL)) {
                    sanitizedUrl = invidiousURL + "/watch?v=" + url.searchParams.get("v");
                } else {
                    sanitizedUrl = invidiousURL + "/watch?v=" + url.pathname.substring(1);
                }

                window.open(sanitizedUrl, target);
                return false;
            });
        }
    }
};

document.addEventListener("DOMContentLoaded", deYouTubifyLinks);
