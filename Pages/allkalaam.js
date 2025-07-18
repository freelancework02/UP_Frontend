async function statusloading() {
  try {
    const res = await fetch(`https://updated-naatacademy.onrender.com/api/dashboard/stats`);
    if (!res.ok) throw new Error("Failed to fetch stats");

    const data = await res.json();
    const stats = data.stats;

    console.log("Status Data:", stats);

    // Update kalam (poetry) count
    

    // Optionally update others if needed:
    const allTab = document.querySelector('[data-tab="all"]');
    const articlesTab = document.querySelector('[data-tab="articles"]');
    const writersTab = document.querySelector('[data-tab="writers"]');
    const kalaamTab = document.querySelector('[data-tab="kalam"]');

    if (allTab) allTab.innerHTML = `تمام (${(stats.poetry + stats.articles + stats.writers) || 0})`;
    if (articlesTab) articlesTab.innerHTML = `مضامین (${stats.articles || 0})`;
    if (writersTab) writersTab.innerHTML = `شعراء (${stats.writers || 0})`;
    if (kalaamTab) kalaamTab.innerHTML = `کلام(${stats.poetry || 0})`;

  } catch (error) {
    console.error("Error loading stats:", error);
    const container = document.querySelector(".container");
    if (container)
      container.innerHTML = "<p class='text-red-600'>ڈیٹا لوڈ کرنے میں مسئلہ ہوا۔</p>";
  }
}

window.addEventListener("DOMContentLoaded", statusloading);



document.addEventListener("DOMContentLoaded", () => {
    loadTabData();
});

async function loadTabData() {
    try {
        const [kalaamRes, articleRes, writerRes] = await Promise.all([
            fetch("https://updated-naatacademy.onrender.com/api/kalaam/limited?limit=4&offset=11"),
            fetch("https://updated-naatacademy.onrender.com/api/articles"),
            fetch("https://updated-naatacademy.onrender.com/api/writers/limited?limit=4&offset=0")
        ]);

        const [kalaamData, articleData, writerData] = await Promise.all([
            kalaamRes.json(),
            articleRes.json(),
            writerRes.json()
        ]);

        const allContainer = document.getElementById("all");
        allContainer.innerHTML = ""; // Clear existing content

        // Render Kalaam
        kalaamData?.data?.forEach(kalaam => {
            allContainer.innerHTML += `
                <article class="result-item-card">
                    <h2 class="kalam-title urdu-text urdu-text-md">${kalaam.Title}</h2>
                    <p class="kalam-excerpt urdu-text urdu-text-base line-clamp-2">${kalaam.ContentUrdu}</p>
                    <div class="item-meta">
                        <div class="flex items-center gap-2">
                            <div class="poet-icon-container"><img src="https://res.cloudinary.com/awescreative/image/upload/v1749156252/Awes/writer.svg" alt="Poet Icon"></div>
                            <p class="urdu-text urdu-text-xs m-0 p-0">${kalaam.WriterName || 'نامعلوم'}</p>
                        </div>
                        <div class="meta-stats">
                            <span class="urdu-text-xs flex items-center gap-1"><i class="bi bi-heart-fill text-red-400"></i> ${kalaam.likes || 0}</span>
                            <span class="urdu-text-xs flex items-center gap-1"><i class="bi bi-eye-fill text-blue-400"></i> ${kalaam.views || 0}</span>
                        </div>
                        <a href="../lyrics.html?id=${kalaam.KalaamID}" class="read-more-link urdu-text"><span>پڑھیں</span><i class="bi bi-arrow-left-short"></i></a>
                    </div>
                </article>
            `;
        });

        // Render Articles
        articleData?.data?.forEach(article => {
            allContainer.innerHTML += `
                <article class="result-item-card">
                    <h2 class="article-title urdu-text urdu-text-md">${article.Title}</h2>
                    <p class="article-excerpt urdu-text urdu-text-sm">${article.ContentUrdu}</p>
                    <div class="item-meta">
                        <div class="flex items-center gap-2">
                            <p class="urdu-text urdu-text-xs m-0 p-0">مضمون نگار: ${article.WriterName || "نامعلوم"}</p>
                        </div>
                        <div class="meta-stats">
                            <span class="urdu-text-xs flex items-center gap-1"><i class="bi bi-heart-fill text-red-400"></i> ${article.likes || 130}</span>
                            <span class="urdu-text-xs flex items-center gap-1"><i class="bi bi-eye-fill text-blue-400"></i> ${article.views || 200}</span>
                        </div>
                        <a href="/articles/${article.ArticleID}" class="read-more-link urdu-text"><span>پڑھیں</span><i class="bi bi-arrow-left-short"></i></a>
                    </div>
                </article>
            `;
        });

        // Render Writers
        writerData?.data?.forEach(writer => {
            allContainer.innerHTML += `
                <article class="result-item-card writer-card">
                    <img src="${writer.image || 'https://placehold.co/60x60/d946ef/ffffff?text=AR'}" alt="Writer Avatar" class="writer-avatar">
                    <div class="flex-grow">
                        <h2 class="writer-name urdu-text urdu-text-md">${writer.Name}</h2>
                        <p class="writer-meta urdu-text urdu-text-xs">${writer.Bio || "تفصیلات دستیاب نہیں"}</p>
                    </div>
                    <a href="/writers/${writer.WriterID}" class="read-more-link urdu-text"><span>پروفائل</span><i class="bi bi-arrow-left-short"></i></a>
                </article>
            `;
        });

    } catch (error) {
        console.error("Error loading tab data:", error);
    }
}



// Kalam
document.addEventListener("DOMContentLoaded", () => {
    loadAllKalaam();
});

async function loadAllKalaam() {
    const container = document.getElementById("kalam");
    container.innerHTML = ""; // Clear placeholder or script content

    let limit = 10;
    let offset = 0;
    let moreData = true;

    try {
        while (moreData) {
            const response = await fetch(`https://updated-naatacademy.onrender.com/api/kalaam/limited?limit=${limit}&offset=${offset}`);
            const result = await response.json();
            const kalaams = result?.data || [];

            // If no more data, stop loop
            if (kalaams.length === 0) {
                moreData = false;
                break;
            }

            kalaams.forEach(kalaam => {
                const excerpt = kalaam.ContentUrdu || "اقتباس دستیاب نہیں";
                container.innerHTML += `
                    <article class="result-item-card">
                        <h2 class="kalam-title urdu-text urdu-text-md">${kalaam.Title}</h2>
                        <p class="kalam-excerpt urdu-text urdu-text-base line-clamp-2">${excerpt}</p>
                        <div class="item-meta">
                            <div class="flex items-center gap-2">
                                <div class="poet-icon-container">
                                    <img src="https://res.cloudinary.com/awescreative/image/upload/v1749156252/Awes/writer.svg" alt="Poet Icon">
                                </div>
                                <p class="urdu-text urdu-text-xs m-0 p-0">${kalaam.writer?.name || 'نامعلوم شاعر'}</p>
                            </div>
                            <div class="meta-stats">
                                <span class="urdu-text-xs flex items-center gap-1">
                                    <i class="bi bi-heart-fill text-red-400"></i> ${kalaam.likes || 0}
                                </span>
                                <span class="urdu-text-xs flex items-center gap-1">
                                    <i class="bi bi-eye-fill text-blue-400"></i> ${kalaam.views || 0}
                                </span>
                            </div>
                            <a href="../lyrics.html?id=${kalaam.KalaamID}" class="read-more-link urdu-text">
                                <span>پڑھیں</span><i class="bi bi-arrow-left-short"></i>
                            </a>
                        </div>
                    </article>
                `;
            });

            offset += limit;
        }
    } catch (error) {
        console.error("کلام لوڈ کرنے میں خرابی:", error);
        container.innerHTML = "<p class='text-red-500 urdu-text'>کلام لوڈ کرنے میں خرابی پیش آئی۔</p>";
    }
}


//articles


document.addEventListener("DOMContentLoaded", () => {
    loadAllArticles();
});

async function loadAllArticles() {
    const container = document.getElementById("articles");
    container.innerHTML = ""; // Clear any existing content

    try {
        const response = await fetch("https://updated-naatacademy.onrender.com/api/articles");
        const result = await response.json();
        const articles = result.data || [];
        console.log("Articles", result)

        if (result.length === 0) {
            container.innerHTML = "<p class='urdu-text text-gray-500'>کوئی مضمون دستیاب نہیں ہے۔</p>";
            return;
        }

        result.forEach(article => {
            container.innerHTML += `
                <article class="result-item-card">
                    <h2 class="article-title urdu-text urdu-text-md">${article.Title}</h2>
                    
                    <div class="item-meta">
                        <div class="flex items-center gap-2">
                            <p class="urdu-text urdu-text-xs m-0 p-0">مضمون نگار: ${article.WriterName || "نامعلوم"}</p>
                        </div>
                        <div class="meta-stats">
                            <span class="urdu-text-xs flex items-center gap-1">
                                <i class="bi bi-heart-fill text-red-400"></i> ${article.likes || 320}
                            </span>
                            <span class="urdu-text-xs flex items-center gap-1">
                                <i class="bi bi-eye-fill text-blue-400"></i> ${article.views || 400}
                            </span>
                        </div>
                        <a href="/Pages/article.html?id=${article.ArticleID}" class="read-more-link urdu-text">
                            <span>پڑھیں</span><i class="bi bi-arrow-left-short"></i>
                        </a>
                    </div>
                </article>
            `;
        });

    } catch (error) {
        console.error("مضامین لوڈ کرنے میں خرابی:", error);
        container.innerHTML = "<p class='text-red-500 urdu-text'>مضامین لوڈ کرنے میں خرابی پیش آئی۔</p>";
    }
}





//Writers


document.addEventListener("DOMContentLoaded", () => {
    loadAllWriters();
});

async function loadAllWriters() {
    const container = document.getElementById("writers");
    container.innerHTML = ""; // Clear existing content

    try {
        const response = await fetch("https://updated-naatacademy.onrender.com/api/writers");
        const result = await response.json();
        const writers = result?.data || [];

        if (result.length === 0) {
            container.innerHTML = "<p class='urdu-text text-gray-500'>کوئی شاعر دستیاب نہیں ہے۔</p>";
            return;
        }

        result.forEach(writer => {
            const initials = getInitials(writer.Name || writer.Name || "??");
            container.innerHTML += `
                <article class="result-item-card writer-card">
                    <img src="https://res.cloudinary.com/awescreative/image/upload/v1749156252/Awes/writer.svg" alt="Writer Avatar" class="writer-avatar">
                    <div class="flex-grow">
                        <h2 class="writer-name urdu-text urdu-text-md">${writer.Name || writer.Name}</h2>
                        <p class="writer-meta urdu-text urdu-text-xs">${writer.Bio || "تفصیل دستیاب نہیں"}</p>
                    </div>
                    <a href="../poet.html?id=${writer.WriterID}" class="read-more-link urdu-text">
                        <span>پروفائل</span><i class="bi bi-arrow-left-short"></i>
                    </a>
                </article>
            `;
        });

    } catch (error) {
        console.error("شاعر لوڈ کرنے میں خرابی:", error);
        container.innerHTML = "<p class='text-red-500 urdu-text'>شاعر لوڈ کرنے میں خرابی پیش آئی۔</p>";
    }
}

// Utility: Get initials from name (Urdu safe fallback)
function getInitials(name) {
    const parts = name.trim().split(" ");
    return parts.length >= 2
        ? (parts[0][0] + parts[1][0])
        : name.slice(0, 2);
}




