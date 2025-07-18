function cleanText(text) {
    return text?.replace(/(<([^>]+)>)/gi, "") || "تفصیل دستیاب نہیں";
  }

  async function loadArticleDetail() {
    const urlParams = new URLSearchParams(window.location.search);
    const articleId = urlParams.get("id");

    if (!articleId) {
      document.querySelector(".article-container").innerHTML = "<p class='text-red-600'>آرٹیکل ID نہیں ملا۔</p>";
      return;
    }

    try {
      const res = await fetch(`https://updated-naatacademy.onrender.com/api/articles/${articleId}`);
      if (!res.ok) throw new Error("Failed to fetch article");

      const article = await res.json();
      console.log("Article Data:", article);

      // Update content
      document.querySelector(".article-title").textContent = article.Title || "عنوان دستیاب نہیں";
      document.querySelector(".article-header-image").src = article.imageUrl || "https://placehold.co/800x300?text=No+Image";
      document.querySelector(".author-info p.font-semibold").textContent = article.WriterName || "نامعلوم مصنف";
      document.querySelector(".author-info p.text-gray-500").textContent = `اشاعت: ${article.CreatedOn?.split("T")[0] || "تاریخ دستیاب نہیں"}`;
      document.querySelector(".article-category-tag").textContent = article.CategoryName || "مضمون";
      document.querySelector(".category").textContent = article.CategoryName || "مضمون";
      document.querySelector(".article-body").innerHTML = cleanText(article.ContentUrdu);
      document.querySelector(".articletitle").textContent = article.Title || " فضائلِ درود شریف...";
      

      // Update WhatsApp Share URL
      const shareURL = `https://naatacademy.com/article.html?id=${articleId}`;
      document.querySelector("a[href*='api.whatsapp.com']").href = `https://api.whatsapp.com/send?text=${encodeURIComponent(article.Title)} - نعت اکیڈمی\n\n${shareURL}`;

    } catch (error) {
      console.error("Error loading article:", error);
      document.querySelector(".article-container").innerHTML = "<p class='text-red-600'>آرٹیکل لوڈ کرنے میں مسئلہ ہوا۔</p>";
    }
  }

  // Run after page is loaded
  window.addEventListener("DOMContentLoaded", loadArticleDetail);





async function RelatedArticle() {
  try {
    const res = await fetch(`https://updated-naatacademy.onrender.com/api/articles`);
    if (!res.ok) throw new Error("Failed to fetch articles");

    const articles = await res.json();

    const container = document.querySelector(".relatedarticlecontainer");
    container.innerHTML = ""; // Clear existing static cards

    // Loop through the first 4 articles (or fewer if not enough)
    articles.slice(0, 4).forEach((article) => {
      const shareURL = `https://naatacademy.com/article.html?id=${article.ArticleID}`;

      const card = document.createElement("a");
      card.href = `./Pages/article.html?id=${article.ArticleID}`;
      card.className = "card block";

      card.innerHTML = `
        <img src="${article.imageUrl || "https://placehold.co/400x200"}" alt="${article.Title}" class="card-thumbnail">
        <div class="card-content">
            <h4 class="urdu-text urdu-text-md font-semibold text-purple-700 mb-1 text-right relatedartitle">${article.Title || "عنوان دستیاب نہیں"}</h4>
            <p class="urdu-text urdu-text-xs text-gray-600 description">${article.WriterName || "مصنف نامعلوم"}</p>
        </div>
      `;

      container.appendChild(card);
    });

  } catch (error) {
    console.error("Error loading related articles:", error);
    const container = document.querySelector(".relatedarticlecontainer");
    container.innerHTML = "<p class='text-red-600'>متعلقہ مضامین لوڈ کرنے میں مسئلہ ہوا۔</p>";
  }
}

// Run when DOM is ready
window.addEventListener("DOMContentLoaded", RelatedArticle);


