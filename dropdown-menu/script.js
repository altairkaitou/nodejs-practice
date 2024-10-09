document.addEventListener("DOMContentLoaded", function() {
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach(item => {
        item.addEventListener('click', function(event) {
            event.preventDefault;

            const submenu = event.querySelector('.submenu');

            if(submenu) {
                const isVisible = submenu.style.display === 'block';
                submenu.style.display = isVisible ? 'none' : 'block';
            }
        })

    })


})