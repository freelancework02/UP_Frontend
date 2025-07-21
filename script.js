document.addEventListener("DOMContentLoaded", async () => {
  try {
    const response = await fetch("https://updated-naatacademy.onrender.com/api/dashboard/stats");
    const data = await response.json();

    if (data.success && data.stats) {
      const stats = data.stats;

      // Map your stat keys to categories
      const statMapping = {
        'category-naat': stats.poetry || 0,
        'category-salam': stats.poetry || 0,
        'category-manqabat': stats.poetry || 0,
        'category-qataat': stats.poetry || 0,
        'category-mawzoat': stats.topics || 0,
        'category-shayar': stats.writers || 0,
        'category-mazameen': stats.articles || 0,
        'category-kutub': stats.books || 0
      };

      // Update each card
      for (const [categoryClass, count] of Object.entries(statMapping)) {
        const el = document.querySelector(`.${categoryClass} .category-post-count`);
        if (el) el.textContent = formatCount(count);
      }
    }
  } catch (error) {
    console.error("Failed to fetch stats:", error);
  }

  // Optional: Format numbers (e.g. 1500 → 1.5k)
  function formatCount(num) {
    if (num >= 1000) return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
    return num;
  }
});


function cleanText(text) {
  if (!text) return "";

  // Remove special characters but preserve Urdu/Arabic characters and basic punctuation
  return text.replace(/[^\u0600-\u06FF\u0750-\u077F\uFB50-\uFDFF\uFE70-\uFEFF\u200F\s.,،؛؟!]/g, '');
}

// const topicsRef = collection(db, "topics");

// Get DOM element
// Get DOM element
const categoryButtonsContainer = document.getElementById("categoryButtons");

// Fetch data and render buttons
async function loadCategories() {
  try {
    const response = await fetch(
      "https://updated-naatacademy.onrender.com/api/categories"
    );
    const categories = await response.json();

    categories.forEach((category) => {
      const categoryName = category.Name || "نامعلوم";
      const postCount = category.postCount || 25; // Default value if not provided
      const bgcolor = category.Color || "#3712b0";

      // Create button
      const button = document.createElement("button");
      button.className = `category-tag urdu-text-xs category-${categoryName} bg-[${bgcolor}] text-gray text-shadow-2xl header-category-tag`;
      button.setAttribute("data-category", categoryName);

      // Inner span structure
      button.innerHTML = `
        <span class="category-name">${categoryName}</span>
        <span class="category-post-count">${postCount}</span>
      `;

      categoryButtonsContainer.appendChild(button);
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
  }
}

async function loadMiladArticles() {
  try {
    const response = await fetch(
      "https://updated-naatacademy.onrender.com/api/articles"
    );
    const articles = await response.json();

    // Update the section header with article data
    const sectionHeader = document.querySelector(
      ".milad-banner-section .text-center h2"
    );
    const sectionDescription = document.querySelector(
      ".milad-banner-section .text-center p"
    );

    // Assuming the first article has the section info
    if (articles.length > 0) {
      const firstArticle = articles[0];

      // Update section title and description
      sectionHeader.innerHTML = `
        <span class="section-title-icon-wrapper bg-gradient-to-r from-purple-600 to-pink-600">
          <i class="bi bi-gift-fill section-title-icon"></i>
        </span>
        ${firstArticle.SectionName || "۱۵۰۰ سو سالہ جشنِ عید میلاد النبی ﷺ"}
      `;

      sectionDescription.textContent =
        firstArticle.description ||
        "سیرت، شاعری، مقالات، اور واقعات کا ایک منفرد مجموعہ";
    }

    // Group articles by their topic
    const articlesByTopic = {};
    articles.forEach((article) => {
      if (!articlesByTopic[article.topic]) {
        articlesByTopic[article.topic] = [];
      }
      articlesByTopic[article.topic].push(article);
    });

    // Update tab buttons based on available topics
    const tabsContainer = document.querySelector(".milad-tabs-container");
    tabsContainer.innerHTML = ""; // Clear existing tabs

    // Create a mapping between topic names and their corresponding CSS classes
    const topicStyles = {
      سیرت: {
        bg: "bg-purple-200",
        text: "text-purple-800",
        hover: "hover:bg-purple-300",
      },
      شاعری: {
        bg: "bg-pink-200",
        text: "text-pink-800",
        hover: "hover:bg-pink-300",
      },
      مقالات: {
        bg: "bg-red-200",
        text: "text-red-800",
        hover: "hover:bg-red-300",
      },
      واقعات: {
        bg: "bg-orange-200",
        text: "text-orange-800",
        hover: "hover:bg-orange-300",
      },
    };

    // Add default tab if no articles exist
    if (Object.keys(articlesByTopic).length === 0) {
      const defaultTab = document.createElement("button");
      defaultTab.dataset.tab = "milad-default";
      defaultTab.className =
        "milad-tab-button urdu-text urdu-text-sm bg-purple-300 text-purple-800 font-semibold py-2 px-5 rounded-full transition-all hover:bg-purple-300 active-tab";
      defaultTab.textContent = "سیرت";
      tabsContainer.appendChild(defaultTab);
    } else {
      // Add tabs for each topic
      Object.keys(articlesByTopic).forEach((topic, index) => {
        const tabId = `milad-${topic.toLowerCase().replace(/\s+/g, "-")}`;
        const style = topicStyles[topic] || topicStyles["سیرت"]; // Default to "سیرت" style if not found

        const tabButton = document.createElement("button");
        tabButton.dataset.tab = tabId;
        tabButton.className = `milad-tab-button urdu-text urdu-text-sm ${style.bg
          } ${style.text} font-semibold py-2 px-5 rounded-full transition-all ${style.hover
          } ${index === 0 ? "active-tab" : ""}`;

        // Use the TopicName from the first article in this topic group
        const topicName = articlesByTopic[topic][0].TopicName || topic;
        tabButton.textContent = topicName;

        tabsContainer.appendChild(tabButton);
      });
    }

    // Clear all tab contents first
    document.querySelectorAll(".milad-tab-content").forEach((content) => {
      content.classList.add("hidden");
      content.innerHTML = "";
    });

    // Populate each tab content
    Object.entries(articlesByTopic).forEach(([topic, topicArticles]) => {
      const tabId = `milad-${topic.toLowerCase().replace(/\s+/g, "-")}`;
      let container = document.getElementById(tabId);

      // Create container if it doesn't exist
      if (!container) {
        container = document.createElement("div");
        container.id = tabId;
        container.className =
          "milad-tab-content  grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 hidden";
        document
          .querySelector(".milad-tab-content-wrapper")
          .appendChild(container);
      }

      // Clear existing content
      container.innerHTML = "";

      // Add articles to the container
      topicArticles.forEach((article) => {
        const articleElement = document.createElement("article");
        articleElement.className = "card p-4";

        // Determine color based on topic
        let colorClass = "text-purple-700";
        if (topic === "شاعری") colorClass = "text-pink-700";
        else if (topic === "مقالات") colorClass = "text-red-700";
        else if (topic === "واقعات") colorClass = "text-orange-700";

        // Extract first line of description
        const description = article.Title || "تفصیل دستیاب نہیں";
        const firstLine = description.split("\n")[0]; // Get first line

        articleElement.innerHTML = `
  <h5 class="urdu-text urdu-text-md font-semibold ${colorClass} mb-2 text-right ">${article.Title || "عنوان"
          }</h5>
  <p class="urdu-text urdu-text-sm text-gray-700 text-right element line-clamp-1">${firstLine}</p>
  <div class="stats-bar">
    <span><i class="bi bi-heart text-gray-500"></i> <span class="like-count urdu-text-xs">${article.likes || "1.4k"
          }</span></span>
    <span><i class="bi bi-eye-fill text-blue-500"></i> <span class="view-count urdu-text-xs">${article.views || "2.2k"
          }</span></span>
  </div>
`;

        container.appendChild(articleElement);
      });

      // Show the first tab by default
      if (Object.keys(articlesByTopic).indexOf(topic) === 0) {
        container.classList.remove("hidden");
      }
    });

    // Add tab switching functionality
    document.querySelectorAll(".milad-tab-button").forEach((button) => {
      button.addEventListener("click", function () {
        // Remove active class from all buttons
        document.querySelectorAll(".milad-tab-button").forEach((btn) => {
          btn.classList.remove("active-tab");
        });

        // Add active class to clicked button
        this.classList.add("active-tab");

        // Hide all tab contents
        document.querySelectorAll(".milad-tab-content").forEach((content) => {
          content.classList.add("hidden");
        });

        // Show the selected tab content
        const tabId = this.dataset.tab;
        document.getElementById(tabId)?.classList.remove("hidden");
      });
    });
  } catch (error) {
    console.error("Error loading Milad articles:", error);
    // You might want to show an error message to the user
  }
}

// Call the function when needed
loadMiladArticles();


//   try {
//     // Initialize Firebase if not already done
//     const postsRef = db.collection('kalamPosts'); // Change 'posts' to your collection name
//     const snapshot = await postsRef.limit(7).get(); // Limit to 7 posts

//     const wrapper = document.querySelector('#peshkashSlider .slider-wrapper');
//     wrapper.innerHTML = ''; // Clear existing slides

//     if (snapshot.empty) {
//       console.warn("No posts found");
//       return;
//     }

//     snapshot.forEach(doc => {
//       const post = doc.data();
//       const lines = post.postUrdu // Assuming field is named postUrdu in Firestore
//         .split(/،|\n|\.|\r|!|\?|(?<=ہیں)/)
//         .map(line => line.trim())
//         .filter(line => line.length > 0);

//       const couplet = lines.slice(0, 2).join('<br>');
//       const poet = post.writer || ''; // Assuming field is named writer in Firestore

//       const slide = document.createElement('div');
//       slide.className = 'slider-slide p-4 text-center special-offering-slide-content';
//       slide.innerHTML = `
//         <p class="urdu-text urdu-text-lg sm:urdu-text-xl text-gray-800 leading-loose max-w-2xl mx-auto special-offering-slide-couplet">
//           ${couplet}
//         </p>
//         <p class="urdu-text urdu-text-xs sm:urdu-text-sm text-gray-600 block mt-3 special-offering-slide-poet">
//           ${poet}
//         </p>
//       `;

//       wrapper.appendChild(slide);
//     });

//     // After injecting new slides, re-init the slider
//     initSlider('peshkashSlider');

//   } catch (error) {
//     console.error("Error loading special offering:", error);
//   }
// };


let writerdata = []; // Store fetched writers data globally

async function loadwritersCards() {
  try {
    const container = document.getElementById("poets-container");
    if (!container) {
      console.error("Container #poets-container not found");
      return;
    }

    // Show loading state
    container.innerHTML = "<p>Loading poets...</p>";

    const response = await fetch(
      "https://updated-naatacademy.onrender.com/api/writers/limited?limit=4&offset=0"
    );
    
    // Check if response is OK
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("API Response:", data); // Debugging log

    // Check if data contains an array of writers
    let writersArray = [];
    
    // Case 1: Direct array response
    if (Array.isArray(data)) {
      writersArray = data;
    } 
    // Case 2: Array nested in a property (common in APIs)
    else if (data.data && Array.isArray(data.data)) {
      writersArray = data.data;
    }
    // Case 3: Array nested in 'writers' property
    else if (data.writers && Array.isArray(data.writers)) {
      writersArray = data.writers;
    }
    // Case 4: Array nested in 'results' property
    else if (data.results && Array.isArray(data.results)) {
      writersArray = data.results;
    }
    else {
      throw new Error("Invalid API response format - no writers array found");
    }

    writerdata = writersArray; // Save data globally

    // Clear container
    container.innerHTML = "";

    // Check if we got any writers
    if (writersArray.length === 0) {
      container.innerHTML = "<p>No poets found.</p>";
      return;
    }

    // Process each writer
    writersArray.forEach((poet) => {
      const id = poet.WriterID || poet.id || poet.writerId;
      const name = poet.Name || poet.name || "Unknown Poet";
      const imageUrl = poet.imageUrl || poet.image || poet.avatar || 
        "https://res.cloudinary.com/awescreative/image/upload/v1749156252/Awes/writer.svg";
      const bio = poet.Bio || poet.bio || poet.description || "No biography available";
      
      const card = document.createElement("article");
      card.className = "card p-5 poet-card transform transition-all hover:scale-105 bg-gray-50";
      card.dataset.id = id;

      card.innerHTML = `
        <div class="poet-icon-container poet-icon-gradient-1">
          <img src="${imageUrl}" 
               alt="${name} Icon" class="poet-icon-image">
        </div>
        <h5 class="urdu-text urdu-text-base sm:urdu-text-md font-semibold text-gray-800">
          ${name}
        </h5>
        ${(poet.wiladat || poet.Wisal || poet.birthDate || poet.deathDate) ?
          `<p class="urdu-text urdu-text-xs text-gray-600 mb-1">
            ${poet.wiladat || poet.birthDate ? 'ولادت: ' + (poet.wiladat || poet.birthDate) : ''}
            ${(poet.wiladat || poet.birthDate) && (poet.Wisal || poet.deathDate) ? ' - ' : ''}
            ${poet.Wisal || poet.deathDate ? 'وفات: ' + (poet.Wisal || poet.deathDate) : ''}
          </p>` :
          '<p class="urdu-text urdu-text-xs text-gray-600 mb-1">ولادت و وفات: نامعلوم</p>'
        }
        <p class="urdu-text urdu-text-xs text-gray-700 leading-snug line-clamp-1">
          ${bio}
        </p>
        <p class="urdu-text urdu-text-xs text-green-600 mt-2 font-semibold">کلام: ${poet.kalaamCount || poet.poemsCount || '200+'}</p>
      `;

      card.addEventListener("click", () => {
        window.location.href = `poet.html?id=${id}`;
      });

      container.appendChild(card);
    });
  } catch (error) {
    console.error("Failed to load writers:", error);
    const container = document.getElementById("poets-container");
    if (container) {
      container.innerHTML = `<p>Error loading poets: ${error.message}</p>`;
    }
  }
}

// Execute the function when the page loads
document.addEventListener('DOMContentLoaded', loadwritersCards);



async function fetchKalaam() {
  try {
    const kalamContainer = document.getElementById("kalampost");
    if (!kalamContainer) {
      console.error("Container element not found");
      return;
    }

    // Show loading state
    kalamContainer.innerHTML = `
      <div class="flex justify-center items-center h-48">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    `;

    const response = await fetch(
      "https://updated-naatacademy.onrender.com/api/kalaam/limited?limit=4"
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Handle different response formats (array or object with data property)
    const kalaams = Array.isArray(data) ? data :
      (data.data || data.kalaams || []);

    // Clear container efficiently
    kalamContainer.innerHTML = "";

    // Color classes for cards
    const titleColorClasses = ["amber", "blue", "rose"];
    const defaultImage = "https://placehold.co/300x150?text=Kalaam";

    // Use document fragment for better performance
    const fragment = document.createDocumentFragment();

    kalaams.slice(0, 4).forEach((item, index) => {
      const titleColorClass = titleColorClasses[index % titleColorClasses.length];
      const safeContent = item.ContentUrdu || item.contentUrdu || "";
      const contentLines = safeContent.split("\n").filter(line => line.trim());

      const card = document.createElement('article');
      card.className = `cursor-pointer card p-4 hover:bg-${titleColorClass}-50 transition-colors duration-300 poetry-types-card`;
      card.onclick = () => window.location.href = `lyrics.html?id=${item.KalaamID || item._id || ''}`;

      card.innerHTML = `
        <div class="flex justify-between items-center mb-3 poetry-type-title-group">
          <h3 class="text-xl urdu-text urdu-text-md font-bold text-${titleColorClass}-700 poetry-type-title">
            ${item.CategoryName || item.categoryName || "کلام"}
          </h3>
          <a href="category.html?category=${encodeURIComponent(item.CategoryName || '')}" 
             class="text-sm text-${titleColorClass}-600 hover:text-${titleColorClass}-800 urdu-text urdu-text-xs font-medium transition-colors poetry-type-collection-link">
            مجموعہ <i class="bi bi-arrow-left-short"></i>
          </a>
        </div>
        <img src="${item.ImageUrl || defaultImage}"
             alt="${item.Title || 'کلام'}"
             class="w-full h-36 object-cover rounded-lg mb-3 shadow-sm poetry-type-image"
             onerror="this.onerror=null;this.src='${defaultImage}'">
        <p class="urdu-text urdu-text-sm text-gray-700 leading-relaxed poetry-type-description">
          ${contentLines.slice(0, 2).join("<br>") || "کلام کا متن دستیاب نہیں"}
        </p>
        <div class="stats-bar poetry-type-stats-bar mt-3">
          <span><i class="bi bi-heart text-gray-500"></i> <span class="like-count urdu-text-xs">${formatCount(item.likes || 0)}</span></span>
          <span><i class="bi bi-eye-fill text-blue-500"></i> <span class="view-count urdu-text-xs">${formatCount(item.views || 0)}</span></span>
          <button class="share-icon-button" onclick="event.stopPropagation(); shareKalaam('${item.KalaamID || ''}')">
            <i class="bi bi-share-fill"></i>
          </button>
        </div>
      `;

      fragment.appendChild(card);
    });

    kalamContainer.appendChild(fragment);

  } catch (error) {
    console.error("Error fetching kalaam:", error);
    const kalamContainer = document.getElementById("kalampost");
    if (kalamContainer) {
      kalamContainer.innerHTML = `
        <div class="text-center p-8 text-red-500">
          <p class="urdu-text text-lg">کلام لوڈ کرنے میں مسئلہ پیش آیا</p>
          <p class="text-sm mt-2">${error.message}</p>
          <button onclick="fetchKalaam()" class="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors">
            دوبارہ کوشش کریں
          </button>
        </div>
      `;
    }
  }
}


function formatCount(num) {
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k';
  }
  return num.toString();
}

// Share function
function shareKalaam(kalaamId) {
  if (navigator.share) {
    navigator.share({
      title: 'نعت اکیڈمی',
      text: 'اس خوبصورت کلام کو دیکھیں',
      url: `https://naatacademy.com/lyrics.html?id=${kalaamId}`
    }).catch(err => console.log('Error sharing:', err));
  } else {
    // Fallback for browsers that don't support Web Share API
    const shareUrl = `https://naatacademy.com/lyrics.html?id=${kalaamId}`;
    prompt("کاپی کرنے کے لیے لنک منتخب کریں:", shareUrl);
  }
}


// In your main page's JavaScript (where you fetch the kalaam list)
// Global variable (if not already defined)
let muntakhibKalaam = null;

async function fetchmuntakhibKalaam() {
  try {
    // Use global data if already loaded, otherwise fetch
    if (!muntakhibKalaam) {
      const response = await fetch("https://updated-naatacademy.onrender.com/api/kalaam/limited?limit=6");
      if (!response.ok) throw new Error("Failed to fetch kalaam data");
      const data = await response.json();

      // Handle both array response and object-with-data response formats
      muntakhibKalaam = Array.isArray(data) ? data :
        (data.data || data.kalaams || [data]);
    }

    const container = document.getElementById("kalaam-container");
    if (!container) {
      console.error("Container element not found");
      return;
    }

    container.innerHTML = ""; // Clear previous content

    // Ensure we're working with an array and take first 6 items
    const kalaamList = Array.isArray(muntakhibKalaam) ?
      muntakhibKalaam.slice(0, 6) :
      [muntakhibKalaam];

    kalaamList.forEach((item) => {
      // Safely extract content lines
      const content = item.ContentUrdu || item.contentUrdu || "";
      const firstTwoLines = content.split(/\r?\n/)
        .filter(line => line.trim())
        .slice(0, 2)
        .join("<br>");

      // Safely extract other properties
      const kalaamId = item.KalaamID || item._id || "";
      const category = item.CategoryName || item.categoryName || item.SectionName || "کلام";
      const poet = item.WriterName || item.writerName || "نامعلوم";

      const kalaamHTML = `
        <article class="card p-4 bg-white selected-kalaam-card cursor-pointer" 
                 onclick="window.location.href='lyrics.html?id=${kalaamId}'">
          <h4 class="urdu-text urdu-text-md sm:urdu-text-lg font-semibold text-green-700 mb-2 text-right selected-kalaam-title">
              ${category}
          </h4>
          <p class="urdu-text urdu-text-sm sm:urdu-text-base text-gray-700 leading-relaxed mb-3 text-right selected-kalaam-couplet">
              ${firstTwoLines || "کلام کا متن دستیاب نہیں"}
          </p>
          <p class="urdu-text urdu-text-xs text-gray-600 text-right selected-kalaam-poet">
              شاعر: ${poet}
          </p>
          <div class="stats-bar selected-kalaam-stats-bar">
              <span><i class="bi bi-heart-fill text-red-500"></i>
                  <span class="like-count urdu-text-xs">0</span></span>
              <span><i class="bi bi-eye-fill text-blue-500"></i> 
                  <span class="view-count urdu-text-xs">0</span></span>
              <button class="share-icon-button"><i class="bi bi-share-fill"></i></button>
          </div>
          <div class="mt-4 flex justify-start items-center">
              <span class="category-tag urdu-text-xs selected-kalaam-category-tag">
                ${category}
              </span>
          </div>
        </article>`;

      container.insertAdjacentHTML("beforeend", kalaamHTML);
    });
  } catch (error) {
    console.error("❌ Error fetching Muntakhib Kalaam:", error);
    // Optional: Display error to user
    const container = document.getElementById("kalaam-container");
    if (container) {
      container.innerHTML = `
        <div class="text-center p-4 text-red-500">
          <p class="urdu-text">کلام لوڈ کرنے میں مسئلہ پیش آیا</p>
          <p class="text-sm">${error.message}</p>
        </div>`;
    }
  }
}




async function duroodsalam() {
  try {
    const response = await fetch(
      "https://updated-naatacademy.onrender.com/api/kalaam"
    );
    if (!response.ok) throw new Error("Network response was not ok");

    const data = await response.json();

    const container = document.getElementById("durood-container");
    if (!container) {
      console.error("Container not found!");
      return;
    }

    container.innerHTML = ""; // Clear existing content

    data.slice(0, 3).forEach((item, index) => {
      // Only show first 3 items
      const card = document.createElement("article");
      card.className = `card p-4 text-right durood-salam-card cursor-pointer ${index >= 2 ? "hidden md:block" : ""
        }`;

      // Get kalaam ID and title
      const kalaamId = item._id || item.KalaamID;
      const kalaamTitle = encodeURIComponent(item.Title || item.title || "درود شریف");

      // Make card clickable
      card.addEventListener("click", () => {
        window.location.href = `lyrics.html?id=${kalaamId}&title=${kalaamTitle}`;
      });

      // Title
      const title = document.createElement("h5");
      title.className =
        "urdu-text urdu-text-md font-semibold text-gray-800 durood-salam-title";
      title.textContent = item.Title || item.title || "درود شریف";

      // Description (first line only)
      const description = document.createElement("p");
      description.className =
        "urdu-text urdu-text-sm text-gray-700 durood-salam-description";
      const descText =
        item.ContentUrdu ||
        item.description ||
        item.content ||
        "درود شریف کی تفصیل";
      description.textContent = descText.split("\n")[0].substring(0, 50); // Limit to first line/50 chars

      // Stats bar
      const statsBar = document.createElement("div");
      statsBar.className = "stats-bar";
      statsBar.innerHTML = `
        <span><i class="bi bi-heart text-gray-500"></i> <span class="like-count urdu-text-xs">${item.likes || "1.4k"
        }</span></span>
        <span><i class="bi bi-eye-fill text-blue-500"></i> <span class="view-count urdu-text-xs">${item.views || "2.2k"
        }</span></span>
        <button class="share-icon-button"><i class="bi bi-share-fill"></i></button>
      `;

      // Add share functionality
      const shareBtn = statsBar.querySelector(".share-icon-button");
      shareBtn.addEventListener("click", (e) => {
        e.stopPropagation(); // Prevent card click
        const shareUrl = `https://freelancework02.github.io/UP_Frontend/lyrics.html?id=${kalaamId}&title=${kalaamTitle}`;

        if (navigator.share) {
          navigator.share({
            title: `${item.Title || item.title || "درود شریف"} | Naat Academy`,
            text: `یہ درود شریف پڑھیں: ${item.Title || item.title || "درود شریف"}`,
            url: shareUrl
          }).catch(err => console.log('Error sharing:', err));
        } else {
          const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(
            `یہ درود شریف پڑھیں: ${item.Title || item.title || "درود شریف"}\n${shareUrl}`
          )}`;
          window.open(whatsappUrl, '_blank');
        }
      });

      card.appendChild(title);
      card.appendChild(description);
      card.appendChild(statsBar);
      container.appendChild(card);
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    // Fallback to default content with proper links
    const container = document.getElementById("durood-container");
    if (container) {
      container.innerHTML = `
        <article class="card p-4 text-right durood-salam-card cursor-pointer" onclick="window.location.href='lyrics.html?id=1&title=درودِ ابراہیمی'">
          <h5 class="urdu-text urdu-text-md font-semibold text-gray-800 durood-salam-title">درودِ ابراہیمی</h5>
          <p class="urdu-text urdu-text-sm text-gray-700 durood-salam-description">نماز میں پڑھا جانے والا مشہور درود۔</p>
          <div class="stats-bar">
            <span><i class="bi bi-heart text-gray-500"></i> <span class="like-count urdu-text-xs">1.4k</span></span>
            <span><i class="bi bi-eye-fill text-blue-500"></i> <span class="view-count urdu-text-xs">2.2k</span></span>
            <button class="share-icon-button" onclick="event.stopPropagation(); window.open('https://wa.me/?text=${encodeURIComponent('یہ درود شریف پڑھیں: درودِ ابراہیمی\nhttps://freelancework02.github.io/UP_Frontend/lyrics.html?id=1&title=درودِ ابراہیمی')}', '_blank')">
              <i class="bi bi-share-fill"></i>
            </button>
          </div>
        </article>
        <article class="card p-4 text-right durood-salam-card cursor-pointer" onclick="window.location.href='lyrics.html?id=2&title=درودِ تاج'">
          <h5 class="urdu-text urdu-text-md font-semibold text-gray-800 durood-salam-title">درودِ تاج</h5>
          <p class="urdu-text urdu-text-sm text-gray-700 durood-salam-description">ایک معروف اور بابرکت درود شریف۔</p>
          <div class="stats-bar">
            <span><i class="bi bi-heart text-gray-500"></i> <span class="like-count urdu-text-xs">1.4k</span></span>
            <span><i class="bi bi-eye-fill text-blue-500"></i> <span class="view-count urdu-text-xs">2.2k</span></span>
            <button class="share-icon-button" onclick="event.stopPropagation(); window.open('https://wa.me/?text=${encodeURIComponent('یہ درود شریف پڑھیں: درودِ تاج\nhttps://freelancework02.github.io/UP_Frontend/lyrics.html?id=2&title=درودِ تاج')}', '_blank')">
              <i class="bi bi-share-fill"></i>
            </button>
          </div>
        </article>
        <article class="card p-4 text-right hidden md:block durood-salam-card cursor-pointer" onclick="window.location.href='lyrics.html?id=3&title=فضائلِ درود'">
          <h5 class="urdu-text urdu-text-md font-semibold text-gray-800 durood-salam-title">فضائلِ درود</h5>
          <p class="urdu-text urdu-text-sm text-gray-700 durood-salam-description">درود شریف پڑھنے کے فضائل و برکات۔</p>
          <div class="stats-bar">
            <span><i class="bi bi-heart text-gray-500"></i> <span class="like-count urdu-text-xs">1.4k</span></span>
            <span><i class="bi bi-eye-fill text-blue-500"></i> <span class="view-count urdu-text-xs">2.2k</span></span>
            <button class="share-icon-button" onclick="event.stopPropagation(); window.open('https://wa.me/?text=${encodeURIComponent('یہ درود شریف پڑھیں: فضائلِ درود\nhttps://freelancework02.github.io/UP_Frontend/lyrics.html?id=3&title=فضائلِ درود')}', '_blank')">
              <i class="bi bi-share-fill"></i>
            </button>
          </div>
        </article>
      `;
    }
  }
}

// Call the function when page loads
document.addEventListener("DOMContentLoaded", duroodsalam);



async function Fetchgroupcontainer() {
  try {
    const response = await fetch("https://updated-naatacademy.onrender.com/api/articles");
    if (!response.ok) throw new Error("Network response was not ok");

    const data = await response.json();
    console.log("API Data:", data); // Debug

    const container = document.getElementById("group-container");
    if (!container) {
      console.error("Container not found!");
      return;
    }

    container.innerHTML = ""; // Clear existing content

    const colorClasses = [
      'text-green-700', 'text-blue-700', 'text-amber-700',
      'text-rose-700', 'text-purple-700', 'text-teal-700'
    ];

    data.slice(0, 6).forEach((item, index) => {
      const card = document.createElement("article");
      card.className = "card p-4 poetry-info-module-card cursor-pointer hover:shadow-md transition";
      card.style.cursor = "pointer";

      // Redirect on click
      const articleID = item.ArticleID || item.id;
      card.addEventListener("click", () => {
        window.location.href = `./Pages/article.html?id=${articleID}`;
      });

      console.log("article id ", articleID);

      // Image
      const img = document.createElement("img");
      img.src = item.imageUrl || "https://images.unsplash.com/photo-1473186505569-9c61870c11f9?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
      img.alt = item.Title || "Module Thumbnail";
      img.className = "w-full h-32 object-cover rounded-lg mb-3 poetry-info-thumbnail";

      // Title
      const title = document.createElement("h5");
      title.className = `urdu-text urdu-text-md font-semibold mb-2 text-right poetry-info-module-title ${colorClasses[index % colorClasses.length]}`;
      title.textContent = item.Title || item.title || `مڈول ${index + 1}`;

      // Description
      const description = document.createElement("p");
      description.className = "urdu-text urdu-text-sm text-gray-700 leading-relaxed text-right poetry-info-module-content line-clamp-3";
      const rawDescription = item.ContentUrdu || item.description || item.content || "تفصیل دستیاب نہیں";
      const cleanedDescription = cleanText(rawDescription);
      description.textContent = cleanedDescription;

      // Stats bar
      const statsBar = document.createElement("div");
      statsBar.className = "stats-bar flex justify-between items-center mt-3";
      statsBar.innerHTML = `
        <span><i class="bi bi-heart text-gray-500"></i> <span class="like-count urdu-text-xs">${item.likes || "0"}</span></span>
        <span><i class="bi bi-eye-fill text-blue-500"></i> <span class="view-count urdu-text-xs">${item.views || "0"}</span></span>
        <button class="share-icon-button"><i class="bi bi-share-fill"></i></button>
      `;

      // Assemble the card
      card.appendChild(img);
      card.appendChild(title);
      card.appendChild(description);
      card.appendChild(statsBar);

      container.appendChild(card);
    });

  } catch (error) {
    console.error("Error fetching data:", error);

    const container = document.getElementById("group-container");
    if (container) {
      container.innerHTML = `
        <article class="card p-4 poetry-info-module-card">
          <img src="https://images.unsplash.com/photo-1473186505569-9c61870c11f9?q=80&w=1170&auto=format&fit=crop" alt="Poetry Intro" class="w-full h-32 object-cover rounded-lg mb-3">
          <h5 class="urdu-text urdu-text-md font-semibold text-green-700 mb-2 text-right poetry-info-module-title">مڈول 1: شاعری کی تعریف اور اقسام</h5>
          <p class="urdu-text urdu-text-sm text-gray-700 leading-relaxed text-right poetry-info-module-content line-clamp-3">شاعری ایک ایسا فن ہے جس میں جذبات اور خیالات کا اظہار خوبصورت الفاظ اور منظم طریقوں سے کیا جاتا ہے۔</p>
          <div class="stats-bar flex justify-between items-center mt-3">
            <span><i class="bi bi-heart text-gray-500"></i> <span class="like-count urdu-text-xs">0</span></span>
            <span><i class="bi bi-eye-fill text-blue-500"></i> <span class="view-count urdu-text-xs">0</span></span>
            <button class="share-icon-button"><i class="bi bi-share-fill"></i></button>
          </div>
        </article>
      `;
    }
  }
}


// Make sure to call the function
Fetchgroupcontainer();


// Call the function when page loads
// document.addEventListener("DOMContentLoaded", Fetchgroupcontainer);



// Call the function when the page loads

fetchKalaam();
fetchmuntakhibKalaam();


let kalamData = null; // Global store to avoid multiple fetches


async function loadSelectedKalamSnippets() {
  try {
    // Fetch data from API
    const response = await fetch("https://updated-naatacademy.onrender.com/api/kalaam");
    if (!response.ok) throw new Error("Network response was not ok");
    const data = await response.json();

    const selectedCards = document.querySelectorAll(".selected-kalaam-card");

    // Process first 4 items or available cards
    const itemsToShow = Math.min(data.length, selectedCards.length, 4);

    for (let i = 0; i < itemsToShow; i++) {
      const post = data[i];
      const urduKalam = post.ContentUrdu || "";

      // Break into lines
      const lines = urduKalam
        .split(/،|\n|\.|\r|!|\?|(?<=ہیں)/)
        .map(line => line.trim())
        .filter(line => line.length > 0);

      const couplet = lines.slice(0, 2).join("<br>");

      // Update DOM
      const card = selectedCards[i];
      const coupletP = card.querySelector(".selected-kalaam-couplet");
      if (coupletP) coupletP.innerHTML = couplet;

      // Make card clickable
      const kalamId = post._id || post.KalaamID;
      const kalamTitle = encodeURIComponent(post.Title || "کلام");
      card.style.cursor = "pointer";
      card.addEventListener("click", () => {
        window.location.href = `lyrics.html?id=${kalamId}&title=${kalamTitle}`;
      });
    }
  } catch (error) {
    console.error("❌ Error loading selected kalaam snippets:", error);
  }
}




async function loadBlogCards() {
  try {
    const response = await fetch(
      "https://updated-naatacademy.onrender.com/api/articles"
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const articles = await response.json();

    const container = document.getElementById("blogCardsContainer");
    container.innerHTML = "";

    // Shuffle articles to show different ones each time
    const shuffledArticles = articles.sort(() => 0.5 - Math.random());
    const selectedArticles = shuffledArticles.slice(0, 10); // Get first 10 after shuffle

    selectedArticles.forEach((article) => {
      const title = article.Title || "بدون عنوان";
      const postUrdu = article.ContentUrdu || article.ContentUrdu || "";

      // Process the content to create a preview (max 1 line)
      const descriptionLines =
        postUrdu.split(/،|\n|\.|\r|!|\?|(?<=ہیں)/)[0] || ""; // Take only first segment

      const truncatedDescription =
        descriptionLines.length > 50
          ? descriptionLines.substring(0, 50) + "..."
          : descriptionLines;

      const card = document.createElement("article");
      card.className = "card p-4 relative article-card h-48"; // Fixed height

      card.innerHTML = `
        <div class="flex flex-col h-full cursor-pointer" >
          <span class="article-category-tag bg-teal-100 text-teal-600 urdu-text text-xs font-medium mb-2">${article.category || "نعت"
        }</span>
          
          <h4 class="urdu-text text-md font-semibold text-teal-700 mb-2 text-right line-clamp-2" 
              style="height: 3em; overflow: hidden;">
            ${title}
          </h4>
          
          <p class="urdu-text text-sm  text-right line-clamp-2 " 
             >
            ${truncatedDescription}
          </p>
          
          <div class="flex items-center justify-end mt-auto pt-3 border-t border-gray-100">
            <p class="urdu-text text-xs text-gray-600 mr-2 truncate" style="max-width: 120px;">
              ${article.WriterName || "شعر کا مفہوم: اے غوث اعظم..."}
            </p>
            <div class="w-8 h-8 rounded-full overflow-hidden">
              <img src="${article.writerImage ||
        "https://res.cloudinary.com/awescreative/image/upload/v1749154741/Awes/User_icon.svg"
        }"
                   alt="Writer Icon" class="w-full h-full object-cover">
            </div>
          </div>
          
          <div class="stats-bar flex justify-between items-center mt-2">
            <span class="flex items-center">
              <i class="bi bi-heart-fill text-red-500 text-xs"></i>
              <span class="like-count urdu-text text-xs mr-1">${formatNumber(
          article.likes || 0
        )}</span>
            </span>
            <span class="flex items-center">
              <i class="bi bi-eye-fill text-blue-500 text-xs"></i>
              <span class="view-count urdu-text text-xs mr-1">${formatNumber(
          article.views || 0
        )}</span>
            </span>
            <button class="share-icon-button text-gray-500">
              <i class="bi bi-share-fill text-xs"></i>
            </button>
          </div>
        </div>
      `;

      // Add click event to navigate to article detail page
      card.addEventListener("click", (e) => {
        if (!e.target.closest(".share-icon-button")) {
          window.location.href = `./Pages/article.html?id=${article.ArticleID || article.ArticleID
            }`;
        }
      });

      // Add share functionality
      const shareBtn = card.querySelector(".share-icon-button");
      shareBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        shareArticle(article);
      });

      container.appendChild(card);
    });
  } catch (error) {
    console.error("Error loading blog cards:", error);
    const container = document.getElementById("blogCardsContainer");
    container.innerHTML = `
      <div class="text-center py-8">
        <i class="bi bi-exclamation-triangle-fill text-yellow-500 text-4xl"></i>
        <h3 class="urdu-text text-xl mt-4">مقالات لوڈ کرنے میں مسئلہ پیش آیا</h3>
        <p class="urdu-text mt-2">${error.message}</p>
      </div>
    `;
  }
}


function shareArticle(article) {
  if (navigator.share) {
    navigator
      .share({
        title: article.title,
        text: article.content?.substring(0, 100) || "",
        url:
          window.location.origin +
          `/article-detail.html?id=${article._id || article.id}`,
      })
      .catch((err) => console.log("Error sharing:", err));
  } else {
    // Fallback for browsers without Web Share API
    const url =
      window.location.origin +
      `/article-detail.html?id=${article._id || article.id}`;
    navigator.clipboard.writeText(url).then(() => {
      alert("لنک کاپی ہو گیا ہے: " + url);
    });
  }
}

// Helper function to format numbers (1000 => 1k)
function formatNumber(num) {
  return num >= 1000 ? (num / 1000).toFixed(1) + "k" : num;
}

// Call this function when the page loads
document.addEventListener("DOMContentLoaded", function () {
  loadBlogCards();
});



document.addEventListener("DOMContentLoaded", async () => {
    const container = document.getElementById("groupingarticles");
    const title = document.getElementById("groupname");
    const descriptionLink = document.getElementById("groupdescription");

    try {
        const res = await fetch("http://localhost:5000/api/articles/sectionone");
        const data = await res.json();

        if (data.success && data.data.length > 0) {
            const firstArticle = data.data[0];

            // Set group title and description
            title.innerText = firstArticle.GroupName || 'نام دستیاب نہیں';
            descriptionLink.innerHTML = `${firstArticle.description || 'مزید معلومات'} <i class="bi bi-arrow-left-short ml-1"></i>`;

            // Generate article cards
            data.data.forEach(article => {
                const card = document.createElement("article");
                card.className = "card p-4 poetry-info-module-card";

                const imageUrl = article.ThumbnailURL
                    ? 'data:image/jpeg;base64,' + btoa(
                        new Uint8Array(article.ThumbnailURL.data)
                            .reduce((data, byte) => data + String.fromCharCode(byte), '')
                      )
                    : "https://via.placeholder.com/300x150?text=No+Image";

                card.innerHTML = `
                    <img src="${imageUrl}"
                        alt="Module Thumbnail"
                        class="w-full h-32 object-cover rounded-lg mb-3 poetry-info-thumbnail">

                    <h5 class="urdu-text urdu-text-md font-semibold text-rose-700 mb-2 text-right poetry-info-module-title">
                        ${article.Title || 'بدون عنوان'}
                    </h5>

                    <p class="urdu-text urdu-text-sm text-gray-700 leading-relaxed text-right poetry-info-module-content">
                        ${article.ContentUrdu ? article.ContentUrdu.substring(0, 300) + '...' : 'کوئی تفصیل دستیاب نہیں'}
                    </p>

                    <div class="stats-bar">
                        <span><i class="bi bi-heart text-gray-500"></i> <span class="like-count urdu-text-xs">0</span></span>
                        <span><i class="bi bi-eye-fill text-blue-500"></i> <span class="view-count urdu-text-xs">0</span></span>
                        <button class="share-icon-button"><i class="bi bi-share-fill"></i></button>
                    </div>
                `;

                container.appendChild(card);
            });

        } else {
            container.innerHTML = "<p class='text-center urdu-text'>کوئی مضمون دستیاب نہیں</p>";
        }

    } catch (err) {
        console.error("Error loading articles:", err);
        container.innerHTML = "<p class='text-center text-red-600'>ڈیٹا لوڈ کرنے میں ناکامی</p>";
    }
});



// Load on page
loadBlogCards();





loadCategories();
