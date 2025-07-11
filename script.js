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
  const kalamPostsRef = collection(db, "articlePosts");
  const kalamQuery = query(kalamPostsRef, limit(10));
  const snapshot = await getDocs(kalamQuery);

  const container = document.getElementById("blogCardsContainer"); // Add this div in your HTML
  container.innerHTML = "";

  snapshot.forEach((doc) => {
    const post = doc.data();
    const title = post.title || "بدون عنوان"; // You can change field name if needed
    const postUrdu = post.BlogText || post.BlogText?.urdu ;
    
    const descriptionLines = postUrdu
      .split(/،|\n|\.|\r|!|\?|(?<=ہیں)/)
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .slice(0, 7)
      .join("۔ ");

    const card = document.createElement("article");
    card.className = "card p-4 relative article-card";

    card.innerHTML = `
      <span class="article-category-tag bg-teal-100 text-teal-600 urdu-text urdu-text-xs font-medium">نعت</span>
      <h4 class="urdu-text urdu-text-md sm:urdu-text-lg font-semibold text-teal-700 mb-2 mt-9 text-right article-title">
        ${title}
      </h4>
      <p class="urdu-text urdu-text-xs sm:urdu-text-sm text-gray-700 leading-relaxed mb-4 text-right article-preview-text"
        style="max-height: 10.5em; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 7; -webkit-box-orient: vertical;">
        ${descriptionLines}
      </p>
      <div class="flex items-center justify-end mt-3 pt-3 border-t border-gray-100 article-meta-row">
        <p class="urdu-text urdu-text-xs text-gray-600 article-writer-info">>شعر کا مفہوم: اے غوث اعظم...</p>
        <div class="writer-icon-container writer-icon-bg-1 article-writer-icon-container">
          <img src="${post.writerImage || 'https://res.cloudinary.com/awescreative/image/upload/v1749154741/Awes/User_icon.svg'}"
               alt="Writer Icon" class="article-writer-icon">
        </div>
      </div>
      <div class="stats-bar article-stats-bar">
        <span><i class="bi bi-heart-fill text-red-500"></i> <span class="like-count urdu-text-xs">${post.likes || "1.9k"}</span></span>
        <span><i class="bi bi-eye-fill text-blue-500"></i> <span class="view-count urdu-text-xs">${post.views || "2.6k"}</span></span>
        <button class="share-icon-button"><i class="bi bi-share-fill"></i></button>
      </div>
    `;

    container.appendChild(card);
  });
}

// Load on page
loadBlogCards();


loadKalamSnippets()
loadSelectedKalamSnippets()

loadwritersCards()

  loadCategories();