document.addEventListener('DOMContentLoaded', function() {
    // Set current year in footer
    document.getElementById('currentYear').textContent = new Date().getFullYear();

    // DOM elements
    const searchInput = document.getElementById('searchInput');
    const categoryFilter = document.getElementById('categoryFilter');
    const bookGrid = document.getElementById('bookGrid');
    const noResultsMessage = document.getElementById('noResultsMessage');
    const thumbnailViewBtn = document.getElementById('thumbnailViewBtn');
    const listViewBtn = document.getElementById('listViewBtn');

    let booksData = []; // For storing fetched data

    // Map tags to categories (if necessary)
    function categoryFromTag(tag) {
        if (!tag) return "نامعلوم";
        if (tag.includes("نعت")) return "نعتیہ شاعری";
        if (tag.includes("سیرت")) return "سیرت";
        if (tag.includes("کلیات")) return "کلیات";
        if (tag.includes("تصوف")) return "تصوف";
        return tag;
    }

    // Render all books
    function renderBooks(books) {
        bookGrid.innerHTML = "";
        if (!books || books.length === 0) {
            noResultsMessage.classList.remove('hidden');
            bookGrid.innerHTML = "";
            return;
        }
        noResultsMessage.classList.add('hidden');
        books.forEach(book => {
            const imageUrl = book.image
                ? book.image
                : 'https://placehold.co/400x600/8e44ad/ffffff?text=' + encodeURIComponent(book.bookName || "کتاب");
            const kalamCount = book.kalamCount || '—'; // optional
            const views = book.views || Math.floor(Math.random()*2000)+500; // fake a view count for demo

            // For text direction, fallback as needed
            const author = (book.writerName || "نامعلوم مصنف");
            const desc = (book.postLanguage1 || "کوئی تفصیل دستیاب نہیں۔");
            const bookTitle = (book.bookName || "کتاب");
            const bookCategory = categoryFromTag(book.tag);
            const slug = book.slug || book.title || "#";

            // Card HTML (same as template)
            bookGrid.innerHTML += `
                <article class="card p-4 book-item flex flex-col"
                    data-category="${bookCategory}" 
                    data-kalam-count="${kalamCount}">
                    <a href="/books/${slug}" class="book-card-image-link">
                        <img src="${imageUrl}" alt="${slug}"
                            class="book-card-image mb-4 shadow-md"
                            onerror="this.onerror=null;this.src='https://placehold.co/400x600/8e44ad/ffffff?text=${slug}';">
                    </a>
                    <div class="flex flex-col flex-grow">
                        <h5 class="book-title urdu-text urdu-text-md font-semibold text-gray-800 mb-1 text-right">
                            ${bookTitle}
                        </h5>
                        <p class="book-author urdu-text urdu-text-sm text-gray-600 mb-2 text-right">
                            ${author}
                        </p>
                        <p class="urdu-text urdu-text-xxs text-gray-500 mb-3 text-right line-clamp-2">
                            ${desc}
                        </p>
                        <div class="stats-bar mt-auto">
                            <span class="flex items-center urdu-text urdu-text-xs text-gray-500" title="کلام کی تعداد">
                                <i class="bi bi-body-text"></i> ${kalamCount} کلام
                            </span>
                            <span class="flex items-center urdu-text urdu-text-xs text-gray-500" title="دیکھے گئے">
                                <i class="bi bi-eye-fill"></i> ${views.toLocaleString('ur-PK')}
                            </span>
                            <a href="/books/${slug}" class="read-button urdu-text urdu-text-xs ml-auto">پڑھیں</a>
                        </div>
                    </div>
                </article>
            `;
        });
    }

    // Filtering logic
    function filterBooks() {
        const searchTerm = searchInput.value.trim().toLowerCase();
        const selectedCategory = categoryFilter.value;
        const isAll = (selectedCategory === 'all');
        const filtered = booksData.filter(book => {
            const bookTitle = (book.bookName || "").toLowerCase();
            const author = (book.writerName || "").toLowerCase();
            const category = categoryFromTag(book.tag);
            const matchesSearch = !searchTerm || bookTitle.includes(searchTerm) || author.includes(searchTerm);
            const matchesCategory = isAll || category === selectedCategory;
            return matchesSearch && matchesCategory;
        });
        renderBooks(filtered);
    }

    // View toggle
    thumbnailViewBtn.addEventListener('click', () => {
        bookGrid.classList.remove('list-view');
        thumbnailViewBtn.classList.add('active');
        listViewBtn.classList.remove('active');
    });
    listViewBtn.addEventListener('click', () => {
        bookGrid.classList.add('list-view');
        listViewBtn.classList.add('active');
        thumbnailViewBtn.classList.remove('active');
    });

    // Search and filter handlers
    searchInput.addEventListener('keyup', filterBooks);
    categoryFilter.addEventListener('change', filterBooks);

    // ====== FETCH DATA FROM ROUTE AND INITIALIZE ======
    fetch("https://updated-naatacademy.onrender.com/api/testing?limit=20&offset=65")
        .then(res => res.json())
        .then(json => {
            // Expecting: [{...}, {...}, ...]
            if (Array.isArray(json)) {
                booksData = json;
            } else if (json && json.data && Array.isArray(json.data)) { // in case wrapped
                booksData = json.data;
            } else if (json && typeof json === "object") {
                booksData = [json];
            } else {
                booksData = [];
            }
            renderBooks(booksData);
        })
        .catch(err => {
            bookGrid.innerHTML = '<div class="text-red-500 urdu-text urdu-text-lg p-10 text-center">کتب حاصل کرنے میں مسئلہ ہے۔ براہ کرم دوبارہ کوشش کریں۔</div>';
        });

});