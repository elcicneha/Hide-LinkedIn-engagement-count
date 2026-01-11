// Content script to hide engagement metrics and filter notifications on LinkedIn

// Cache for processed elements to avoid re-processing
const processedElements = new WeakSet();

// Debounce helper to reduce function calls
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function hideEngagementCounts() {
    // Get border style once and cache it
    if (!hideEngagementCounts.borderStyle) {
        const sampleSocialCount = document.querySelector('.social-details-social-counts');
        if (sampleSocialCount) {
            const computedStyle = window.getComputedStyle(sampleSocialCount);
            hideEngagementCounts.borderStyle =
                computedStyle.borderBottomWidth + ' ' +
                computedStyle.borderBottomStyle + ' ' +
                computedStyle.borderBottomColor;
        }
    }

    // Apply border to action bars (only new ones)
    if (hideEngagementCounts.borderStyle) {
        const actionBars = document.querySelectorAll('.feed-shared-social-action-bar, .social-action-bar');
        actionBars.forEach(bar => {
            if (processedElements.has(bar)) return;
            processedElements.add(bar);

            bar.style.setProperty('border-top', hideEngagementCounts.borderStyle, 'important');

            // Check for media - use single query with :has() or check once
            const postContainer = bar.closest('.feed-shared-update-v2');
            if (!postContainer) return;

            const hasMedia = !!(
                postContainer.querySelector('.feed-shared-image, .feed-shared-article, .feed-shared-external-video, .feed-shared-video, .feed-shared-linkedin-video')
            );

            if (!hasMedia) {
                bar.style.setProperty('margin-top', '12px', 'important');
            }
        });
    }

    // Batch hide operations using CSS classes would be better, but since we can't modify CSS dynamically,
    // we'll use more specific selectors and process only new elements

    // Hide social counts sections
    document.querySelectorAll('.social-details-social-counts').forEach(el => {
        if (!processedElements.has(el)) {
            processedElements.add(el);
            el.style.display = 'none';
        }
    });

    // Hide specific count elements
    document.querySelectorAll('.social-details-social-counts__reactions-count, .social-details-social-counts__comments, .social-details-social-counts__num-reposts').forEach(el => {
        if (!processedElements.has(el)) {
            processedElements.add(el);
            el.style.display = 'none';
        }
    });

    // Hide analytics buttons
    document.querySelectorAll('[aria-label*="analytics"]').forEach(el => {
        if (!processedElements.has(el)) {
            processedElements.add(el);
            el.style.display = 'none';
        }
    });

    // Hide facepile and reactions heading
    document.querySelectorAll('.social-details-reactors-facepile__list, .social-details-reactors-facepile__reactions-text').forEach(el => {
        if (!processedElements.has(el)) {
            processedElements.add(el);
            el.style.setProperty('display', 'none', 'important');
        }
    });

    // Hide analytics entry points
    document.querySelectorAll('.content-analytics-entry-point, .analytics-entry-point').forEach(el => {
        if (!processedElements.has(el)) {
            processedElements.add(el);
            el.style.setProperty('display', 'none', 'important');
        }
    });

    // Hide sidebar stats - only check text if not processed
    document.querySelectorAll('.feed-left-nav-growth-widgets__entity-list-item').forEach(el => {
        if (processedElements.has(el)) return;
        const text = el.textContent.toLowerCase();
        if (text.includes('post impression') || text.includes('profile viewer')) {
            processedElements.add(el);
            el.style.setProperty('display', 'none', 'important');
        }
    });

    // Hide impression elements with text check
    document.querySelectorAll('.ca-entry-point__num-views, .social-details-social-activity__social-proof-text').forEach(el => {
        if (processedElements.has(el)) return;
        const text = el.textContent.toLowerCase();
        if ((text.includes('impression') || text.includes('view')) && /\d/.test(text)) {
            processedElements.add(el);
            el.style.setProperty('display', 'none', 'important');
        }
    });
}

function filterNotifications() {

    const notificationWrappers = document.querySelectorAll('div[data-finite-scroll-hotkey-item]:not([data-notification-checked])');

    notificationWrappers.forEach(wrapper => {
        wrapper.dataset.notificationChecked = 'true';

        const headlineLink = wrapper.querySelector('.nt-card__headline');
        if (!headlineLink) return;

        const text = headlineLink.textContent.toLowerCase();

        // Use single regex test for better performance
        const isReactionNotification = /reacted to your|liked your|celebrated your|loved your|supported your|others reacted/.test(text);
        const isImpressionNotification = /impression|view your analytics/.test(text);
        const isCommentNotification = /commented on your|commented on a post|also commented/.test(text);

        if ((isReactionNotification || isImpressionNotification) && !isCommentNotification) {
            wrapper.style.setProperty('display', 'none', 'important');
            wrapper.dataset.notificationFiltered = 'hidden';
        }

        // Hide reaction count sections
        wrapper.querySelectorAll('.nt-social-counts').forEach(section => {
            if (section.textContent.toLowerCase().includes('reaction')) {
                section.style.setProperty('display', 'none', 'important');
            }
        });
    });
}

// Debounced version to avoid too many calls
const debouncedHideEngagementCounts = debounce(hideEngagementCounts, 150);
const debouncedFilterNotifications = debounce(filterNotifications, 150);

// Run immediately
hideEngagementCounts();
filterNotifications();

// Single MutationObserver with debouncing - MUCH more efficient
const observer = new MutationObserver(() => {
    debouncedHideEngagementCounts();
    debouncedFilterNotifications();
});

// Only watch for new elements being added, not attribute changes
observer.observe(document.body, {
    childList: true,
    subtree: true
});

// Remove the setInterval - the MutationObserver is enough!