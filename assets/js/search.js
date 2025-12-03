// This file implements the search functionality, allowing users to search for specific design ideas.

document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('search-results');
    const designItems = document.querySelectorAll('.design-item'); // Assuming each design item has a class of 'design-item'

    searchInput.addEventListener('input', function() {
        const query = searchInput.value.toLowerCase();
        searchResults.innerHTML = ''; // Clear previous results

        designItems.forEach(item => {
            const title = item.querySelector('.design-title').textContent.toLowerCase(); // Assuming each item has a title with class 'design-title'
            const description = item.querySelector('.design-description').textContent.toLowerCase(); // Assuming each item has a description with class 'design-description'

            if (title.includes(query) || description.includes(query)) {
                const resultItem = document.createElement('div');
                resultItem.classList.add('search-result');
                resultItem.innerHTML = `<h3>${item.querySelector('.design-title').textContent}</h3>
                                        <p>${item.querySelector('.design-description').textContent}</p>`;
                searchResults.appendChild(resultItem);
            }
        });
    });
});