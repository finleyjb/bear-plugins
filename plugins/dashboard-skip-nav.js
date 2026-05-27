/*
 Plugin name: Dashboard skip nav
 Description: Adds a skip navigation link for accessibility and screen readers on the dashboard.
 Author: Herman Martinus
 Author URI: https://herman.bearblog.dev
*/

(function() {
    'use strict';

    document.addEventListener("DOMContentLoaded", function() {
        const main = document.querySelector('main');
        if (!main) return;

        if (!main.id) {
            main.id = 'main-content';
        }

        const skipLink = document.createElement('a');
        skipLink.href = '#' + main.id;
        skipLink.textContent = 'Skip to main content';
        skipLink.setAttribute('class', 'skip-nav-link');

        const style = document.createElement('style');
        style.textContent = [
            '.skip-nav-link {',
            '    position: absolute;',
            '    top: -100%;',
            '    left: 0;',
            '    padding: 0.5em 1em;',
            '    background: #000;',
            '    color: #fff;',
            '    text-decoration: none;',
            '    z-index: 9999;',
            '}',
            '.skip-nav-link:focus {',
            '    top: 0;',
            '}'
        ].join('\n');

        document.head.appendChild(style);
        document.body.insertBefore(skipLink, document.body.firstChild);
    });
})();
