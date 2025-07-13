// Import Firebase modules (add this at the top of your file)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, getDocs, limit,
  query } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";


const firebaseConfig = {
  apiKey: "AIzaSyC6tclAI1v3gmseON3S83AAzRGnQck-2Yo",
  authDomain: "naat-academy-3185b.firebaseapp.com",
  databaseURL: "https://naat-academy-3185b-default-rtdb.firebaseio.com",
  projectId: "naat-academy-3185b",
  storageBucket: "naat-academy-3185b.firebasestorage.app",
  messagingSenderId: "246903290372",
  appId: "1:246903290372:web:0d351dd6f1747aa4291351"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);



// const topicsRef = collection(db, "topics");

  // Get DOM element
 // Get DOM element
const categoryButtonsContainer = document.getElementById("categoryButtons");

// Fetch data and render buttons
async function loadCategories() {
  try {
    const response = await fetch("https://updated-naatacademy.onrender.com/api/categories");
    const categories = await response.json();

    categories.forEach((category) => {
      const categoryName = category.Name || "نامعلوم";
      const postCount = category.postCount || 25; // Default value if not provided
      const bgcolor = category.Color || '#3712b0';

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



async function loadMiladPoetryArticles() {
  try {
    const response = await fetch("https://updated-naatacademy.onrender.com/api/articles");
    const articles = await response.json();
    const container = document.getElementById("milad-poetry");
    
    // Clear existing content (if any)
    container.innerHTML = '';
    
    articles.forEach(article => {
      const articleElement = document.createElement("article");
      articleElement.className = "card p-4";
      
      articleElement.innerHTML = `
  <h5 class="urdu-text urdu-text-md font-semibold text-pink-700 mb-2 text-right">${article.Title || "عنوان"}</h5>
  <p class="urdu-text urdu-text-sm text-gray-700 text-right line-clamp-1">${article.Title || "تفصیل دستیاب نہیں"}</p>
  <div class="stats-bar">
    <span><i class="bi bi-heart text-gray-500"></i> <span class="like-count urdu-text-xs">1.4k</span></span>
    <span><i class="bi bi-eye-fill text-blue-500"></i> <span class="view-count urdu-text-xs">2.2k</span></span>
  </div>
`;

      
      container.appendChild(articleElement);
    });
    
    
    // If you need to show the container after loading
    container.classList.remove("hidden");
  } catch (error) {
    console.error("Error loading Milad poetry articles:", error);
    // You might want to show an error message to the user
  }
}

// Call the function when needed
loadMiladPoetryArticles();


//   const loadSpecialOffering = async () => {
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



// async function loadwritersCards() {
//   try {
//     // Reference to your poets collection in Firestore
//     const poetsRef = collection(db, "writers");
//     const querySnapshot = await getDocs(poetsRef);
    
//     // Get the container where cards will be inserted
//     const container = document.getElementById("poets-container"); // You'll need to add this ID to your HTML
    
//     // Clear existing content if needed
//     container.innerHTML = '';
    
//     // Loop through each poet document
//     querySnapshot.forEach((doc) => {
//       const poet = doc.data();
      
//       // Create a new card element
//       const card = document.createElement("article");
//       card.className = "card p-5 poet-card transform transition-all hover:scale-105 bg-gray-50";
      
//       // Set the card's inner HTML using the poet data
//       card.innerHTML = `
//         <div class="poet-icon-container poet-icon-gradient-1">
//           <img src="${poet.imageUrl || 'https://res.cloudinary.com/awescreative/image/upload/v1749156252/Awes/writer.svg'}" 
//                alt="${poet.writerName} Icon" class="poet-icon-image">
//         </div>
//         <h5 class="urdu-text urdu-text-base sm:urdu-text-md font-semibold text-gray-800 poet-name">${poet.writerName}</h5>
//         <p class="urdu-text urdu-text-xs text-gray-600 mb-1 poet-lifespan">ولادت: 1856 - وفات: 1921</p>
//         <p class="urdu-text urdu-text-xs text-gray-700 leading-snug poet-description line-clamp-1">${poet.aboutWriter}</p>
//         <p class="urdu-text urdu-text-xs text-green-600 mt-2 font-semibold poet-kalaam-count">کلام: 200+</p>
//         <div class="stats-bar justify-center poet-stats-bar">
//           <span><i class="bi bi-heart-fill text-red-500"></i> 
//             <span class="like-count urdu-text-xs">20</span>
//           </span>
//           <span><i class="bi bi-eye-fill text-blue-500"></i> 
//             <span class="view-count urdu-text-xs">100</span>
//           </span>
//           <button class="share-icon-button"><i class="bi bi-share-fill"></i></button>
//         </div>
//       `;
      
//       // Add the card to the container
//       container.appendChild(card);
//     });
    
//   } catch (error) {
//     console.error("Error loading poet cards:", error);
//   }
// }



 async function loadwritersCards() {
    try {
      const response = await fetch("https://updated-naatacademy.onrender.com/api/writers");
      const writers = await response.json();

      const container = document.getElementById("poets-container");
      container.innerHTML = "";

      writers.forEach((poet) => {
       const id = poet.WriterID;
        const card = document.createElement("article");
        card.className = "card p-5 poet-card transform transition-all hover:scale-105 bg-gray-50";
        card.dataset.id = id;

        card.innerHTML = `
          <div class="poet-icon-container poet-icon-gradient-1 ">
            <img src="${poet.imageUrl || 'https://res.cloudinary.com/awescreative/image/upload/v1749156252/Awes/writer.svg'}" 
                 alt="${poet.Name} Icon" class="poet-icon-image">
          </div>
          <h5 class="urdu-text urdu-text-base sm:urdu-text-md font-semibold text-gray-800">${poet.Name}</h5>
          <p class="urdu-text urdu-text-xs text-gray-600 mb-1">ولادت: 1856 - وفات: 1921</p>
          <p class="urdu-text urdu-text-xs text-gray-700 leading-snug line-clamp-1">${poet.Bio}</p>
          <p class="urdu-text urdu-text-xs text-green-600 mt-2 font-semibold">کلام: 200+</p>
        `;

        card.addEventListener("click", () => {
          window.location.href = `poet.html?id=${id}`;
        });

        container.appendChild(card);
      });

    } catch (error) {
      console.error("Failed to load writers:", error);
      document.getElementById("poets-container").innerHTML = "<p>Error loading poets.</p>";
    }
  }



  async function fetchKalaam() {
    const response = await fetch("https://updated-naatacademy.onrender.com/api/kalaam");
    const data = await response.json();

    const kalamContainer = document.getElementById("kalampost");
    kalamContainer.innerHTML = ""; // Clear existing

    data.forEach((item, index) => {
        const titleColorClass = ["amber", "blue", "rose"][index % 3]; // cycle through colors

        const card = `
            <article class="card p-4 hover:bg-${titleColorClass}-50 transition-colors duration-300 poetry-types-card">
                <div class="flex justify-between items-center mb-3 poetry-type-title-group">
                    <h3 class="text-xl urdu-text urdu-text-md font-bold text-${titleColorClass}-700 poetry-type-title">
                        ${item.CategoryName}
                    </h3>
                    <a href="#" class="text-sm text-${titleColorClass}-600 hover:text-${titleColorClass}-800 urdu-text urdu-text-xs font-medium transition-colors poetry-type-collection-link">
                        مجموعہ <i class="bi bi-arrow-left-short"></i>
                    </a>
                </div>
                <img src="https://img.freepik.com/free-photo/books-imagination-still-life_23-2149082172.jpg"
                    alt="${item.Title}"
                    class="w-full h-36 object-cover rounded-lg mb-3 shadow-sm poetry-type-image"
                    onerror="this.onerror=null;this.src='https://placehold.co/300x150?text=Kalaam';">
                <p class="urdu-text urdu-text-sm text-gray-700 leading-relaxed poetry-type-description">
                    ${item.ContentUrdu.split('\n').slice(0, 2).join('<br>')}
                </p>
                <div class="stats-bar poetry-type-stats-bar">
                    <span><i class="bi bi-heart text-gray-500"></i> <span class="like-count urdu-text-xs">1.2k</span></span>
                    <span><i class="bi bi-eye-fill text-blue-500"></i> <span class="view-count urdu-text-xs">2.0k</span></span>
                    <button class="share-icon-button"><i class="bi bi-share-fill"></i></button>
                </div>
            </article>
        `;
        kalamContainer.innerHTML += card;
    });
}




// In your main page's JavaScript (where you fetch the kalaam list)
async function fetchmuntakhibKalaam() {
    try {
        const response = await fetch("https://updated-naatacademy.onrender.com/api/kalaam");
        const data = await response.json();

        const kalaamList = Array.isArray(data) ? data : [data];
        const container = document.getElementById('kalaam-container');
        container.innerHTML = '';

        kalaamList.forEach(item => {
            const firstTwoLines = item.ContentUrdu
                ? item.ContentUrdu.split('\n').slice(0, 2).join('<br>')
                : '';

            const kalaamHTML = `
                <article class="card p-4 bg-white selected-kalaam-card cursor-pointer" 
                         onclick="window.location.href='lyrics.html?id=${item.KalaamID}'">
                    <h4 class="urdu-text urdu-text-md sm:urdu-text-lg font-semibold text-green-700 mb-2 text-right selected-kalaam-title">
                        ${item.SectionName}
                    </h4>
                    <p class="urdu-text urdu-text-sm sm:urdu-text-base text-gray-700 leading-relaxed mb-3 text-right selected-kalaam-couplet">
                        ${firstTwoLines}
                    </p>
                    <p class="urdu-text urdu-text-xs text-gray-600 text-right selected-kalaam-poet">
                        شاعر: ${item.WriterName}
                    </p>
                    <div class="stats-bar selected-kalaam-stats-bar">
                        <span><i class="bi bi-heart-fill text-red-500"></i>
                            <span class="like-count urdu-text-xs">0</span></span>
                        <span><i class="bi bi-eye-fill text-blue-500"></i> 
                            <span class="view-count urdu-text-xs">0</span></span>
                        <button class="share-icon-button"><i class="bi bi-share-fill"></i></button>
                    </div>
                    <div class="mt-4 flex justify-start items-center">
                        <span class="category-tag urdu-text-xs selected-kalaam-category-tag">${item.CategoryName}</span>
                    </div>
                </article>`;
            
            container.insertAdjacentHTML('beforeend', kalaamHTML);
        });
    } catch (error) {
        console.error('Error fetching Kalaam:', error);
    }
}



// JavaScript function to fetch 3 kalaams and show only 2 lines from each
async function Naatkebolfunction() {
    try {
        const response = await fetch("https://updated-naatacademy.onrender.com/api/kalaam");
        const data = await response.json();

        const kalaamList = Array.isArray(data) ? data.slice(0, 3) : [data]; // Limit to first 3

        const container = document.getElementById('naat-bol-container');
        container.innerHTML = ''; // Clear old content

        kalaamList.forEach((item, index) => {
            // Get first two lines from ContentUrdu
            const firstTwoLines = item.ContentUrdu
                ? item.ContentUrdu.split('\n').slice(0, 1).join('<br>')
                : '';

            const isHiddenClass = index === 2 ? 'hidden md:block' : '';

            const cardHTML = `
                <article class="card p-4 text-right naat-lyrics-card ${isHiddenClass}">
                    <h5 class="urdu-text urdu-text-md font-semibold text-gray-800 naat-lyrics-title">
                        ${item.SectionName}
                    </h5>
                    <p class="urdu-text urdu-text-sm text-gray-700 naat-lyrics-preview">
                        ${firstTwoLines}
                    </p>
                    <div class="stats-bar">
                        <span><i class="bi bi-heart text-gray-500"></i> 
                            <span class="like-count urdu-text-xs">400</span>
                        </span>
                        <span><i class="bi bi-eye-fill text-blue-500"></i> 
                            <span class="view-count urdu-text-xs">230</span>
                        </span>
                        <button class="share-icon-button"><i class="bi bi-share-fill"></i></button>
                    </div>
                </article>`;
            
            container.insertAdjacentHTML('beforeend', cardHTML);
        });
    } catch (error) {
        console.error("Error fetching Naat Kalaam:", error);
    }
}


// async function Naatetalim() {
//     try {
//         const response = await fetch("https://updated-naatacademy.onrender.com/api/kalaam");
//         const data = await response.json();

//         const kalaamList = Array.isArray(data) ? data : [data];

//         // Optional: Filter by education-related category (e.g., CategoryName includes "تعلیم")
//         const educationKalaams = kalaamList
//             .filter(item => item.CategoryName && item.CategoryName.includes("تعلیم"))
//             .slice(0, 3); // Take only first 3

//         const container = document.getElementById('naat-education-container');
//         container.innerHTML = '';

//         educationKalaams.forEach((item, index) => {
//             const firstTwoLines = item.ContentUrdu
//                 ? item.ContentUrdu.split('\n').slice(0, 2).join('<br>')
//                 : '';

//             const isHiddenClass = index === 2 ? 'hidden md:block' : '';

//             const cardHTML = `
//                 <article class="card p-4 text-right naat-education-card ${isHiddenClass}">
//                     <h5 class="urdu-text urdu-text-md font-semibold text-gray-800 naat-education-title">
//                         ${item.Title}
//                     </h5>
//                     <p class="urdu-text urdu-text-sm text-gray-700 naat-education-description">
//                         ${firstTwoLines}
//                     </p>
//                     <div class="stats-bar">
//                         <span><i class="bi bi-heart text-gray-500"></i> 
//                             <span class="like-count urdu-text-xs">0</span>
//                         </span>
//                         <span><i class="bi bi-eye-fill text-blue-500"></i> 
//                             <span class="view-count urdu-text-xs">0</span>
//                         </span>
//                         <button class="share-icon-button"><i class="bi bi-share-fill"></i></button>
//                     </div>
//                 </article>`;
            
//             container.insertAdjacentHTML('beforeend', cardHTML);
//         });
//     } catch (error) {
//         console.error("Error fetching education kalaams:", error);
//     }
// }



fetchKalaam()
fetchmuntakhibKalaam()
Naatkebolfunction()
// Naatetalim()

async function loadKalamSnippets() {
  try {
    const kalamPostsRef = collection(db, "kalamPosts");
    const kalamQuery = query(kalamPostsRef, limit(4));
    const querySnapshot = await getDocs(kalamQuery);

    const articleCards = document.querySelectorAll("#kalampost .poetry-types-card");

    let index = 0;
    querySnapshot.forEach((doc) => {
      if (index >= articleCards.length) return;

      const post = doc.data();
      const urduKalam = post.postUrdu || "";
      const tag = post.tags || "کلام"; // fallback if tag not found

      // Extract two meaningful lines
      const lines = urduKalam
        .split(/،|\n|\.|\r|!|\?|(?<=ہیں)/)
        .map((line) => line.trim())
        .filter((line) => line.length > 0);

      const couplet = lines.slice(0, 2).join("<br>");

      // Update DOM elements
      const targetCard = articleCards[index];

      const pTag = targetCard.querySelector(".poetry-type-description");
      if (pTag) {
        pTag.innerHTML = couplet;
      }

      const titleTag = targetCard.querySelector(".poetry-type-title");
      if (titleTag) {
        titleTag.textContent = tag;
      }

      index++;
    });

  } catch (error) {
    console.error("❌ Error loading kalam snippets:", error);
  }
}


async function loadSelectedKalamSnippets() {
  try {
    const kalamPostsRef = collection(db, "kalamPosts");
    const kalamQuery = query(kalamPostsRef, limit(4));
    const querySnapshot = await getDocs(kalamQuery);

    const selectedCards = document.querySelectorAll(".selected-kalaam-card");

    let index = 0;
    querySnapshot.forEach((doc) => {
      if (index >= selectedCards.length) return;

      const post = doc.data();
      const urduKalam = post.postUrdu || "";

      // Break into lines
      const lines = urduKalam
        .split(/،|\n|\.|\r|!|\?|(?<=ہیں)/)
        .map((line) => line.trim())
        .filter((line) => line.length > 0);

      const couplet = lines.slice(0, 2).join("<br>");

      const card = selectedCards[index];
      const coupletP = card.querySelector(".selected-kalaam-couplet");

      if (coupletP) {
        coupletP.innerHTML = couplet;
      }

      index++;
    });

  } catch (error) {
    console.error("❌ Error loading selected kalaam snippets:", error);
  }
}


async function loadBlogCards() {
  try {
    const response = await fetch('https://updated-naatacademy.onrender.com/api/articles');
    if (!response.ok) {
      throw new Error('Network response was not ok');
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
      const descriptionLines = postUrdu
        .split(/،|\n|\.|\r|!|\?|(?<=ہیں)/)[0] || ""; // Take only first segment
      
      const truncatedDescription = descriptionLines.length > 50 ? 
        descriptionLines.substring(0, 50) + "..." : 
        descriptionLines;

      const card = document.createElement("article");
      card.className = "card p-4 relative article-card h-48"; // Fixed height

      card.innerHTML = `
        <div class="flex flex-col h-full cursor-pointer">
          <span class="article-category-tag bg-teal-100 text-teal-600 urdu-text text-xs font-medium mb-2">${article.category || "نعت"}</span>
          
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
              <img src="${article.writerImage || 'https://res.cloudinary.com/awescreative/image/upload/v1749154741/Awes/User_icon.svg'}"
                   alt="Writer Icon" class="w-full h-full object-cover">
            </div>
          </div>
          
          <div class="stats-bar flex justify-between items-center mt-2">
            <span class="flex items-center">
              <i class="bi bi-heart-fill text-red-500 text-xs"></i>
              <span class="like-count urdu-text text-xs mr-1">${formatNumber(article.likes || 0)}</span>
            </span>
            <span class="flex items-center">
              <i class="bi bi-eye-fill text-blue-500 text-xs"></i>
              <span class="view-count urdu-text text-xs mr-1">${formatNumber(article.views || 0)}</span>
            </span>
            <button class="share-icon-button text-gray-500">
              <i class="bi bi-share-fill text-xs"></i>
            </button>
          </div>
        </div>
      `;

      // Add click event to navigate to article detail page
      card.addEventListener('click', (e) => {
        if (!e.target.closest('.share-icon-button')) {
          window.location.href = `article-detail.html?id=${article._id || article.id}`;
        }
      });

      // Add share functionality
      const shareBtn = card.querySelector('.share-icon-button');
      shareBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        shareArticle(article);
      });

      container.appendChild(card);
    });

  } catch (error) {
    console.error('Error loading blog cards:', error);
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
    navigator.share({
      title: article.title,
      text: article.content?.substring(0, 100) || '',
      url: window.location.origin + `/article-detail.html?id=${article._id || article.id}`
    }).catch(err => console.log('Error sharing:', err));
  } else {
    // Fallback for browsers without Web Share API
    const url = window.location.origin + `/article-detail.html?id=${article._id || article.id}`;
    navigator.clipboard.writeText(url).then(() => {
      alert('لنک کاپی ہو گیا ہے: ' + url);
    });
  }
}

// Helper function to format numbers (1000 => 1k)
function formatNumber(num) {
  return num >= 1000 ? (num/1000).toFixed(1) + 'k' : num;
}

// Call this function when the page loads
document.addEventListener('DOMContentLoaded', function() {
  loadBlogCards();
});

// Load on page
loadBlogCards();


loadKalamSnippets()
loadSelectedKalamSnippets()

loadwritersCards()

  loadCategories();