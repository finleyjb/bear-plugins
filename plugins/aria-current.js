/*
 Plugin name: Aria current
 Description: Sets the aria-current tag on a relevant link in the nav
 Author: Finley Baker
 Author URI: https://blog.welcomehome.city
*/

(function () {
  "use strict";
  document.addEventListener("DOMContentLoaded", () => {
    const canonicalTag = document.querySelector('link[rel="canonical"]');
    const canonicalPath = new URL(canonicalTag.href).pathname;

    const linkElement = document.querySelector(
      `nav > p > a[href="${canonicalPath}"]`,
    );
    if (linkElement) {
      linkElement.ariaCurrent = "page";
      return;
    }

    // If the link ends with a slash, check the version without a slash. If it
    // doesn't have a slash, check the version with a slash at the end.
    let alternateLink;
    if (canonicalPath.endsWith("/")) {
      alternateLink = canonicalPath.slice(0, -1);
    } else {
      alternateLink = canonicalPath + "/";
    }

    const alternateLinkTag = document.querySelector(
      `nav > p > a[href="${alternateLink}"]`,
    );
    if (alternateLinkTag) {
      alternateLinkTag.ariaCurrent = "page";
    }
  });
})();
