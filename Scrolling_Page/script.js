document.addEventListener("DOMContentLoaded", function() {
    const sections = document.querySelectorAll('.content-section');

    function checkVisibility() {
        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom >= 0) {
                section.classList.add('visible');
            } else {
                section.classList.remove('visible');
            }

        })
    }

    window.addEventListener('scroll', checkVisibility);

    checkVisibility();
})