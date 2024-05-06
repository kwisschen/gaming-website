// gatsby-browser.js
exports.shouldUpdateScroll = ({ routerProps: { location } }) => {
    // Always scroll to the top when navigating to these pages
    const scrollToTopRoutes = [`/genre/`, `/language/`];

    if (scrollToTopRoutes.some(route => location.pathname.includes(route))) {
        window.scrollTo(0, 0);
        return false;
    }
    return true;
};
