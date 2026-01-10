// Content script to hide engagement metrics and filter notifications on LinkedIn

function hideEngagementCounts() {
    // Hide impression/view counts
    const impressionElements = document.querySelectorAll('[class*="social-details-social-activity__social-proof-text"]');
    impressionElements.forEach(el => {
        if (el.textContent.includes('impression') || el.textContent.includes('view')) {
            el.style.display = 'none';
        }
    });

    // Hide reaction counts under posts
    const reactionCounts = document.querySelectorAll('[class*="social-details-social-counts__reactions-count"]');
    reactionCounts.forEach(el => el.style.display = 'none');

    // Hide comment counts
    const commentCounts = document.querySelectorAll('[class*="social-details-social-counts__comments"]');
    commentCounts.forEach(el => el.style.display = 'none');

    // Hide repost counts
    const repostCounts = document.querySelectorAll('[class*="social-details-social-counts__num-reposts"]');
    repostCounts.forEach(el => el.style.display = 'none');

    // Hide entire social counts section (likes, comments, reposts summary)
    const socialCounts = document.querySelectorAll('[class*="social-details-social-counts"]');
    socialCounts.forEach(el => el.style.display = 'none');

    // Hide analytics button on your posts
    const analyticsButtons = document.querySelectorAll('[aria-label*="analytics"]');
    analyticsButtons.forEach(el => el.style.display = 'none');

    // Hide the reactors facepile (profile pictures with reactions on post detail page)
    const facepiles = document.querySelectorAll('ul.social-details-reactors-facepile__list');
    facepiles.forEach(el => el.style.setProperty('display', 'none', 'important'));

    // Hide the "Reactions" heading above the facepile
    const reactionsHeadings = document.querySelectorAll('h3.social-details-reactors-facepile__reactions-text');
    reactionsHeadings.forEach(el => el.style.setProperty('display', 'none', 'important'));

    // Hide the entire analytics entry point section (impressions count on post detail)
    const analyticsEntryPoints = document.querySelectorAll('div.content-analytics-entry-point, a.analytics-entry-point');
    analyticsEntryPoints.forEach(el => el.style.setProperty('display', 'none', 'important'));

    // Hide sidebar stats (Profile viewers and Post impressions in left sidebar)
    const sidebarStats = document.querySelectorAll('li.feed-left-nav-growth-widgets__entity-list-item');
    sidebarStats.forEach(el => {
        const text = el.textContent.toLowerCase();
        if (text.includes('post impression') || text.includes('profile viewer')) {
            el.style.setProperty('display', 'none', 'important');
        }
    });

    // Hide any element with "impressions" in the visible text (catch-all)
    const allElements = document.querySelectorAll('span.ca-entry-point__num-views, [class*="impression"]');
    allElements.forEach(el => {
        const text = el.textContent.toLowerCase();
        if (text.includes('impression') && text.match(/\d/)) {
            el.style.setProperty('display', 'none', 'important');
        }
    });
}

function filterNotifications() {
    // Target the wrapper divs and articles
    const notificationWrappers = document.querySelectorAll('div[data-finite-scroll-hotkey-item]');

    notificationWrappers.forEach(wrapper => {
        // Skip if already processed
        if (wrapper.dataset.notificationChecked) return;
        wrapper.dataset.notificationChecked = 'true';

        // Find the headline link inside this notification
        const headlineLink = wrapper.querySelector('a.nt-card__headline');

        if (headlineLink) {
            const text = headlineLink.textContent.toLowerCase();

            // Check if this is a reaction or impression notification
            const isReactionNotification = (
                text.includes('reacted to your') ||
                text.includes('liked your') ||
                text.includes('celebrated your') ||
                text.includes('loved your') ||
                text.includes('supported your') ||
                text.includes('others reacted')
            );

            const isImpressionNotification = (
                text.includes('impression') ||
                text.includes('view your analytics')
            );

            // Check if this is a comment notification (but NOT about impressions/reactions on comments)
            const isCommentNotification = (
                text.includes('commented on your') ||
                text.includes('commented on a post') ||
                text.includes('also commented')
            );

            // Hide reactions and impressions, but keep actual comment notifications
            if ((isReactionNotification || isImpressionNotification) && !isCommentNotification) {
                wrapper.style.setProperty('display', 'none', 'important');
                wrapper.dataset.notificationFiltered = 'hidden';
            }
        }

        // Also hide the reaction count sections inside notifications
        const reactionCountSections = wrapper.querySelectorAll('section.nt-social-counts');
        reactionCountSections.forEach(section => {
            const text = section.textContent.toLowerCase();
            if (text.includes('reaction')) {
                section.style.setProperty('display', 'none', 'important');
            }
        });
    });
}

function runAllFilters() {
    hideEngagementCounts();
    filterNotifications();
}

// Run immediately
runAllFilters();

// Run whenever the page changes (more aggressive monitoring)
const observer = new MutationObserver(() => {
    filterNotifications();
    hideEngagementCounts();
});

observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['style', 'class']
});

// Run more frequently to catch dynamic loads
setInterval(runAllFilters, 500);