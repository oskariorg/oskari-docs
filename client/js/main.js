$(function() {
    var addActiveClassToNav = function() {
        var pathName = document.location.pathname,
            activePath = pathName.split('/')[1],
            activeNavLink = $('nav ul li a[href="/' + activePath + '"]');

        $('nav ul li').removeClass('active');
        activeNavLink.parent().addClass('active');
    };

    addActiveClassToNav();

    $('pre code').each(function(i, e) {
        $(this).addClass('hljs');
    });
});