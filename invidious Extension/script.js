/*
 Look at all links in the current page and, if any of them references a YouTube video, install a
 click event handler that redirects to the corresponding video on ividio.us.
 
 Author: Francesco Pierfederici <me@pythoninside.com>
 
 Thanks to https://github.com/mperez01/no-youtube for inspiration
 */
// Change here if you host your own invidiuos instance or want another instance
const invidiousURL = "https://www.invidio.us";

// Do not change anything below unless you know what you are doing ;-)
const ythostnames = ["youtube.com",
                     "www.youtube.com",
                     "m.youtube.com",
                     "www.m.youtube.com",
                     "youtu.be",
                     "youtube-nocookie.com",
                     "www.youtube-nocookie.com",
                     ];
const ytrx = /(?:\/|%3D|v=|vi=)([0-9A-z-_]{11})(?:[%#?&]|$)/m;


function alreadySanitized(url) {
    return url.href.startsWith(invidiousURL);
};

function sanitizeYouTubeURL(url) {
    if(alreadySanitized(url)) {
        return url;
    }
    
    const matches = ytrx.exec(url.href);
    if(matches == null || matches.length < 2) {
        console.log("This should not happen, please tell Francesco");
        return null;
    }
    return invidiousURL + "/watch?v=" + matches[1];
};

function sanitizeGoogleURL(url) {
    if(url.searchParams.has("url")) {
        return new URL(url.searchParams.get("url"));
    }
    return new URL(url.searchParams.get("q"));
};

function sanitizeFacebookURL(url) {
    return new URL(url.searchParams.get("u"));
};

function findAnchor(event) {
    var anchor = null;
    for(var n = event.target; n.parentNode; n = n.parentNode) {
        if (n.nodeName === "A") {
            anchor = n;
            break;
        }
    }
    return anchor;
};

function isYouTubeLink(url) {
    return ythostnames.includes(url.hostname);
};

function isGoogleLink(url) {
    // Google is always trying to track you, huh?
    return url.hostname.includes("google") && url.pathname === "/url";
};

function isFacebookLink(url) {
    return url.hostname === "l.facebook.com";
};

function redirectClick(event) {
    // Now, this can change meaning depending on context.
    var anchor = this instanceof HTMLAnchorElement? this : findAnchor(event);
    if(anchor == null) {
        // The user clicked on something we do not care about.
        return true;
    }
    
    // Convert it to a URL object. If this fails, we are not interested in the url.
    var url;
    try {
        url = new URL(anchor.href);
    } catch(e) {
        return true;
    }
    
    // Is this a Google or Facebook link? If so, extract the real link.
    if(isGoogleLink(url)) {
        url = sanitizeGoogleURL(url);
    } else if(isFacebookLink) {
        url = sanitizeFacebookURL(url);
    }
    
    // Is it a youtube link or not?
    if(!isYouTubeLink(url)) {
        return true;
    }
    
    // Yup
    event.preventDefault();
    var target = anchor.target? anchor.target : "_self";
    if (event.ctrlKey || event.metaKey || event.button > 0) {
        target = "_blank";
    }
    
    const sanitizedUrl = sanitizeYouTubeURL(url);
    if(sanitizedUrl == null) {
        // The user might have clicked somewhere else.
        return true;
    }
    
    window.open(sanitizedUrl, target);
    return false;
};

document.addEventListener("click", redirectClick);
