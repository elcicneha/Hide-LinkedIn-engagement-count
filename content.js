// Content script to continuously hide engagement metrics on LinkedIn

function hideEngagementCounts() {
    // Hide impression/view counts
    const impressionElements = document.querySelectorAll('[class*="social-details-social-activity__social-proof-text"]');
    impressionElements.forEach(el => {
        if (el.textContent.includes('impression') || el.textContent.includes('view')) {
            el.style.display = 'none';
        }
    });

    // Hide reaction counts
    const reactionCounts = document.querySelectorAll('[class*="social-details-social-counts__reactions-count"]');
    reactionCounts.forEach(el => el.style.display = 'none');

    // Hide comment counts
    const commentCounts = document.querySelectorAll('[class*="social-details-social-counts__comments"]');
    commentCounts.forEach(el => el.style.display = 'none');

    // Hide repost counts
    const repostCounts = document.querySelectorAll('[class*="social-details-social-counts__num-reposts"]');
    repostCounts.forEach(el => el.style.display = 'none');

    // Hide entire social counts section
    const socialCounts = document.querySelectorAll('[class*="social-details-social-counts"]');
    socialCounts.forEach(el => el.style.display = 'none');

    // Hide analytics buttons
    const analyticsButtons = document.querySelectorAll('[aria-label*="analytics"]');
    analyticsButtons.forEach(el => el.style.display = 'none');
}

// Run immediately
hideEngagementCounts();

// Run whenever the page changes
const observer = new MutationObserver(hideEngagementCounts);
observer.observe(document.body, {
    childList: true,
    subtree: true
});

// Also run periodically as backup
setInterval(hideEngagementCounts, 1000);