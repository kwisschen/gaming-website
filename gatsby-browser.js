// gatsby-browser.js (included for continued efforts for scroll-to-top in the future)
exports.onInitialClientRender = () => {
    if (window.location.pathname.includes('/genre/') || window.location.pathname.includes('/language/')) {
        window.scrollTo(0, 0);
    }
};

exports.shouldUpdateScroll = ({ routerProps: { location } }) => {
    const scrollToTopRoutes = ['/genre/', '/language/'];
    if (scrollToTopRoutes.some(route => location.pathname.includes(route))) {
        return [0, 0];
    }
    return true;
};