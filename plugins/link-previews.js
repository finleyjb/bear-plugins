/*
 Plugin name: Link previews
 Description: Transforms standalone links into rich preview cards with title, description, and image.
 Author: Herman Martinus
 Author URI: https://herman.bearblog.dev
*/

(function() {
    'use strict';

    document.addEventListener("DOMContentLoaded", function() {
        // Find paragraphs that contain only a single anchor tag
        var paragraphs = document.querySelectorAll('p');
        var linkParagraphs = [];

        for (var i = 0; i < paragraphs.length; i++) {
            var p = paragraphs[i];
            var children = p.childNodes;

            // Check if paragraph contains exactly one child that is an anchor
            if (children.length === 1 && children[0].nodeType === 1 && children[0].tagName === 'A') {
                linkParagraphs.push(p);
            }
        }

        if (linkParagraphs.length === 0) return;

        for (var i = 0; i < linkParagraphs.length; i++) {
            (function(p) {
                var anchor = p.querySelector('a');
                var url = anchor.href;

                // Show loading state
                p.style.cssText = 'border: 1px solid #e0e0e0; border-radius: 8px; padding: 16px; margin: 1.5em 0; color: #999; font-size: 0.9em;';
                p.textContent = 'Loading preview...';

                fetch('https://api.microlink.io/?url=' + encodeURIComponent(url))
                    .then(function(res) { return res.json(); })
                    .then(function(response) {
                        if (response.status !== 'success' || !response.data) {
                            restoreLink(p, anchor);
                            return;
                        }

                        var data = response.data;
                        var title = data.title || url;
                        var description = data.description || '';
                        var imageUrl = data.image ? data.image.url : null;
                        var domain = url.replace(/^https?:\/\//, '').split('/')[0];

                        // Truncate description
                        if (description.length > 200) {
                            description = description.substring(0, 200) + '...';
                        }

                        // Build the card
                        var card = document.createElement('a');
                        card.href = url;
                        card.target = '_blank';
                        card.rel = 'noopener';
                        card.className = 'link-preview';
                        card.style.cssText = 'display: flex; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden; text-decoration: none; color: inherit; margin: 1.5em 0; transition: box-shadow 0.2s ease; max-height: 160px;';

                        // Text section
                        var textDiv = document.createElement('div');
                        textDiv.style.cssText = 'flex: 1; padding: 16px; display: flex; flex-direction: column; justify-content: center; overflow: hidden; min-width: 0;';

                        var titleEl = document.createElement('div');
                        titleEl.textContent = title;
                        titleEl.style.cssText = 'font-weight: 600; font-size: 1em; margin-bottom: 4px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;';

                        var descEl = document.createElement('div');
                        descEl.textContent = description;
                        descEl.style.cssText = 'font-size: 0.85em; color: #666; line-height: 1.4; margin-bottom: 8px; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;';

                        var domainEl = document.createElement('div');
                        domainEl.textContent = domain;
                        domainEl.style.cssText = 'font-size: 0.8em; color: #999;';

                        textDiv.appendChild(titleEl);
                        if (description) textDiv.appendChild(descEl);
                        textDiv.appendChild(domainEl);

                        card.appendChild(textDiv);

                        // Image section
                        if (imageUrl) {
                            var imageDiv = document.createElement('div');
                            imageDiv.style.cssText = 'width: 160px; min-width: 160px; background: #f5f5f5;';

                            var img = document.createElement('img');
                            img.src = imageUrl;
                            img.alt = '';
                            img.style.cssText = 'width: 100%; height: 100%; object-fit: cover; display: block;';

                            // If image fails to load, remove the image section
                            img.onerror = function() {
                                imageDiv.remove();
                            };

                            imageDiv.appendChild(img);
                            card.appendChild(imageDiv);
                        }

                        // Hover effect
                        card.addEventListener('mouseenter', function() {
                            card.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
                        });
                        card.addEventListener('mouseleave', function() {
                            card.style.boxShadow = 'none';
                        });

                        // Replace the paragraph with the card
                        p.parentNode.replaceChild(card, p);
                    })
                    .catch(function() {
                        restoreLink(p, anchor);
                    });
            })(linkParagraphs[i]);
        }

        function restoreLink(p, anchor) {
            p.textContent = '';
            p.removeAttribute('style');
            p.appendChild(anchor);
        }
    });
})();
