document.addEventListener("DOMContentLoaded", function () {
  // Get the kalaam ID from URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  const kalaamId = urlParams.get("id");

  // Set current year in footer
  document.getElementById("currentYear").textContent = new Date().getFullYear();

  if (kalaamId) {
    loadKalaamDetail(kalaamId);
  } else {
    // If no ID found, show error and redirect after 3 seconds
    const container = document.getElementById("poetryTextContainer");
    container.innerHTML = `
            <div class="text-center py-8">
                <i class="bi bi-exclamation-triangle-fill text-red-500 text-4xl"></i>
                <h3 class="urdu-text text-xl mt-4">کلام کا ID نہیں ملا</h3>
                <p class="urdu-text mt-2">آپ کو 3 سیکنڈ میں مرکزی صفحہ پر ری ڈائریکٹ کیا جا رہا ہے...</p>
            </div>
        `;

    setTimeout(() => {
      window.location.href = "index.html";
    }, 3000);
  }

  // Initialize modals and other interactive elements
  initializeModals();
  initializeCoupletToggles();
  initializeCopyButtons();
  initializeShareButtons();
});

document.addEventListener('DOMContentLoaded', async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const kalaamId = urlParams.get('id');

  if (kalaamId) {
    try {
      const response = await fetch(`https://updated-naatacademy.onrender.com/api/kalaam/${kalaamId}`);
      const kalaam = await response.json();
      document.title = `${kalaam.Title} | Naat Academy`;

      const descriptionMeta = document.querySelector('meta[name="description"]');
      if (descriptionMeta) {
        descriptionMeta.setAttribute('content', kalaam.ContentUrdu.split('\n')[0].trim());
      }

      const ogTitle = document.querySelector('meta[property="og:title"]');
      if (ogTitle) ogTitle.setAttribute('content', kalaam.Title);

      const ogDesc = document.querySelector('meta[property="og:description"]');
      if (ogDesc) ogDesc.setAttribute('content', kalaam.ContentUrdu.split('\n')[0].trim());

    } catch (error) {
      console.error('Error fetching kalaam:', error);
    }
  }
});


async function loadKalaamDetail(kalaamId) {
  try {
    // Show loading state
    const container = document.getElementById("poetryTextContainer");
    container.innerHTML = `
      <div class="text-center py-8">
        <i class="bi bi-arrow-repeat animate-spin text-teal-500 text-4xl"></i>
        <p class="urdu-text mt-4">کلام لوڈ ہو رہا ہے...</p>
      </div>
    `;

    // Fetch kalaam details
    const response = await fetch(`https://updated-naatacademy.onrender.com/api/kalaam/${kalaamId}`);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const kalaam = await response.json();

    // Update the page title and headers
    document.title = `${kalaam.Title} | Naat Academy`;
    document.getElementById("kalamTitle").textContent = kalaam.Title;
    document.getElementById("breadcrumbKalamTitle").textContent = kalaam.Title;

    // Update meta information
    document.querySelector(".meta-info-item .meta-value.urdu-text").textContent = kalaam.WriterName || "نامعلوم";
    document.querySelector(".bahr-value").textContent = kalaam.Bahr || "نامعلوم";
    document.querySelector(".meta-count").textContent = kalaam.ViewCount || "0";

    // Process lines
    const urduLines = (kalaam.ContentUrdu || "").split("\n").filter(line => line.trim() !== "");
    const romanLines = (kalaam.ContentRomanUrdu || "").split("\n").filter(line => line.trim() !== "");
    const englishLines = (kalaam.ContentEnglish || "").split("\n").filter(line => line.trim() !== "");

    // Ensure all arrays are even and aligned
    const maxLength = Math.max(urduLines.length, romanLines.length, englishLines.length);
    while (urduLines.length < maxLength) urduLines.push('');
    while (romanLines.length < maxLength) romanLines.push('Data dastiyab nahi hai');
    while (englishLines.length < maxLength) englishLines.push('Translation not available');

    let coupletsHTML = "";

    for (let i = 0; i < maxLength; i += 2) {
      const urduLine1 = urduLines[i] || "";
      const urduLine2 = urduLines[i + 1] || "";
      const romanLine1 = romanLines[i] || "";
      const romanLine2 = romanLines[i + 1] || "";
      const englishLine1 = englishLines[i] || "";
      const englishLine2 = englishLines[i + 1] || "";

      coupletsHTML += `
        <div class="couplet">
          <p class="misra urdu-text" data-ur="${urduLine1}" data-ro="${romanLine1}" data-en="${englishLine1}">${urduLine1}</p>
          <p class="misra urdu-text" data-ur="${urduLine2}" data-ro="${romanLine2}" data-en="${englishLine2}">${urduLine2}</p>
          <div class="translation-content">
            <div class="copy-box box-roman">
              <h4 class="roman-text">Roman Urdu</h4>
              <p class="roman-text">${romanLine1}${romanLine2 ? '<br>' + romanLine2 : ''}</p>
              <span class="copy-feedback">Copied!</span>
            </div>
            <div class="copy-box box-meaning">
              <h4 class="urdu-text">English Translation</h4>
              <p class="urdu-text">${englishLine1}${englishLine2 ? '<br>' + englishLine2 : ''}</p>
              <span class="copy-feedback">کاپی ہوگیا!</span>
            </div>
          </div>
        </div>
      `;
    }

    // Render the couplets
    container.innerHTML = coupletsHTML;

    // Reinitialize page functionality
    initializeLanguageToggle();
    initializeCoupletToggles();
    initializeCopyButtons();

  } catch (error) {
    console.error("Error loading kalaam details:", error);
    const container = document.getElementById("poetryTextContainer");
    container.innerHTML = `
      <div class="text-center py-8">
        <i class="bi bi-exclamation-triangle-fill text-red-500 text-4xl"></i>
        <h3 class="urdu-text text-xl mt-4">کلام لوڈ کرنے میں مسئلہ پیش آیا</h3>
        <p class="urdu-text mt-2">${error.message}</p>
        <button onclick="window.location.href='index.html'" class="mt-4 px-4 py-2 bg-green-500 text-white rounded-full">
          مرکزی صفحہ پر جائیں
        </button>
      </div>
    `;
  }
}


// Rest of the JavaScript functions remain the same...
function initializeLanguageToggle() {
  const languageToggle = document.getElementById("languageToggle");
  const misraElements = document.querySelectorAll(".misra");
  const romanBoxes = document.querySelectorAll(".box-roman");
  const meaningBoxes = document.querySelectorAll(".box-meaning");

  if (languageToggle) {
    languageToggle.addEventListener("click", (e) => {
      if (
        e.target.classList.contains("toggle-option") &&
        !e.target.classList.contains("active")
      ) {
        const lang = e.target.dataset.lang;

        // Toggle active class
        document
          .querySelector(".toggle-option.active")
          .classList.remove("active");
        e.target.classList.add("active");

        // Update text content
        misraElements.forEach((el) => {
          let text;
          if (lang === "ro") {
            text = el.dataset.ro || "Data dastiyab nahi hai";
            el.classList.add("roman-text");
            el.classList.remove("urdu-text");
          } else {
            text = el.dataset.ur || "";
            el.classList.remove("roman-text");
            el.classList.add("urdu-text");
          }
          el.textContent = text;
        });

        // Toggle visibility of translation boxes
        romanBoxes.forEach(
          (box) => (box.style.display = lang === "ro" ? "none" : "block")
        );
        meaningBoxes.forEach((box) => (box.style.display = "block"));
      }
    });
  }
}

function initializeModals() {
  // Author modal
  const authorModal = document.getElementById("authorDetailModal");
  const authorTrigger = document.getElementById("authorBoxTrigger");
  const closeAuthorModal = document.getElementById("closeAuthorModal");

  if (authorModal && authorTrigger && closeAuthorModal) {
    authorTrigger.addEventListener(
      "click",
      () => (authorModal.style.display = "block")
    );
    closeAuthorModal.addEventListener(
      "click",
      () => (authorModal.style.display = "none")
    );
    window.addEventListener("click", (e) => {
      if (e.target === authorModal) authorModal.style.display = "none";
    });
  }

  // Bahr modal
  const bahrModal = document.getElementById("bahrDetailModal");
  const bahrTrigger = document.getElementById("bahrBoxTrigger");
  const closeBahrModal = document.getElementById("closeBahrModal");

  if (bahrModal && bahrTrigger && closeBahrModal) {
    bahrTrigger.addEventListener(
      "click",
      () => (bahrModal.style.display = "block")
    );
    closeBahrModal.addEventListener(
      "click",
      () => (bahrModal.style.display = "none")
    );
    window.addEventListener("click", (e) => {
      if (e.target === bahrModal) bahrModal.style.display = "none";
    });
  }
}

function initializeCoupletToggles() {
  const couplets = document.querySelectorAll(".couplet");
  couplets.forEach((couplet) => {
    couplet.addEventListener("click", () => {
      couplet.classList.contains("active")
        ? couplet.classList.remove("active")
        : couplet.classList.add("active");
    });
  });
}

function initializeCopyButtons() {
  document.querySelectorAll(".copy-box").forEach((box) => {
    box.addEventListener("click", (e) => {
      e.stopPropagation();
      const text = box.querySelector("p").innerText;
      navigator.clipboard.writeText(text).then(() => {
        box.classList.add("copied");
        setTimeout(() => box.classList.remove("copied"), 2000);
      });
    });
  });
}

// Update the initializeShareButtons function
// Update the initializeShareButtons function
function initializeShareButtons() {
  const shareButton = document.getElementById("shareButton");
  const whatsappButton = document.querySelector(".whatsapp-button");
  const shareBahrButton = document.getElementById("shareBahrButton");

  if (shareButton) {
    shareButton.addEventListener("click", shareKalaam);
  }

  // Add specific WhatsApp sharing functionality
  if (whatsappButton) {
    whatsappButton.addEventListener("click", function(e) {
      e.preventDefault();
      shareOnWhatsApp();
    });
  }

  if (shareBahrButton && navigator.share) {
    shareBahrButton.addEventListener("click", async () => {
      try {
        await navigator.share({
          title: "بحرِ متدارک - Naat Academy",
          text: "علمِ عروض میں بحرِ متدارک کے بارے میں جانیں",
          url: "https://naat.academy/bahr/mutadarik",
        });
      } catch (e) {
        console.error("Share failed:", e);
      }
    });
  }
}

// Specific function for WhatsApp sharing
function shareOnWhatsApp() {
  const kalaamTitle = document.getElementById("kalamTitle").textContent.trim();
  const urlParams = new URLSearchParams(window.location.search);
  const kalaamId = urlParams.get("id");
  
  // Create share URL with both ID and title
  const shareUrl = `https://updated-naatacademy.onrender.com/share/kalaam/${kalaamId}`;
  
  // Create WhatsApp share link
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(
    `یہ خوبصورت کلام پڑھیں: ${kalaamTitle}\n${shareUrl}`
  )}`;
  
  // Open in new tab
  window.open(whatsappUrl, '_blank');
}

// Updated shareKalaam function (general sharing)
function shareKalaam() {
  const kalaamTitle = document.getElementById("kalamTitle").textContent.trim();
  const urlParams = new URLSearchParams(window.location.search);
  const kalaamId = urlParams.get("id");
  
  // Create share URL with both ID and title
  const shareUrl = `https://updated-naatacademy.onrender.com/share/kalaam/${kalaamId}`;

  if (navigator.share) {
    // Web Share API (for mobile devices)
    navigator.share({
      title: `${kalaamTitle} | Naat Academy`,
      text: `یہ خوبصورت کلام پڑھیں: ${kalaamTitle}`,
      url: shareUrl,
    }).catch(error => console.log('Error sharing:', error));
  } else {
    // Fallback for desktop and browsers without Web Share API
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(
      `یہ خوبصورت کلام پڑھیں: ${kalaamTitle}\n${shareUrl}`
    )}`;
    
    // Create a share menu
    const shareMenu = document.createElement('div');
    shareMenu.className = 'share-menu';
    shareMenu.innerHTML = `
      <div class="share-menu-content">
        <h4 class="urdu-text">شیئر کریں</h4>
        <div class="share-options">
          <a href="${whatsappUrl}" target="_blank" class="share-option whatsapp">
            <i class="bi bi-whatsapp"></i>
            <span class="urdu-text">WhatsApp</span>
          </a>
          <button class="share-option copy-link">
            <i class="bi bi-link-45deg"></i>
            <span class="urdu-text">لنک کاپی کریں</span>
          </button>
        </div>
      </div>
    `;
    
    // Style the share menu
    shareMenu.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    `;
    
    shareMenu.querySelector('.share-menu-content').style.cssText = `
      background: white;
      padding: 1.5rem;
      border-radius: 1rem;
      max-width: 300px;
      width: 90%;
    `;
    
    // Add copy functionality
    shareMenu.querySelector('.copy-link').addEventListener('click', () => {
      navigator.clipboard.writeText(shareUrl).then(() => {
        alert('لنک کاپی ہو گیا ہے!');
        document.body.removeChild(shareMenu);
      });
    });
    
    // Close on click outside
    shareMenu.addEventListener('click', (e) => {
      if (e.target === shareMenu) {
        document.body.removeChild(shareMenu);
      }
    });
    
    document.body.appendChild(shareMenu);
  }
}

// Like button functionality
document.getElementById("likeButton")?.addEventListener("click", function () {
  const icon = this.querySelector("i");
  const countElement = this.querySelector(".count");
  let count = parseInt(countElement.dataset.initialCount, 10);

  this.classList.toggle("liked");

  if (this.classList.contains("liked")) {
    icon.classList.replace("bi-heart", "bi-heart-fill");
    count++;
  } else {
    icon.classList.replace("bi-heart-fill", "bi-heart");
    count--;
  }

  countElement.textContent =
    count >= 1000 ? (count / 1000).toFixed(1) + "k" : count;
});

async function loadRelatedKalaam() {
  try {
    const response = await fetch(
      "https://updated-naatacademy.onrender.com/api/kalaam"
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const allKalaam = await response.json();

    // Get the current kalaam ID from URL to exclude it from related
    const urlParams = new URLSearchParams(window.location.search);
    const currentKalaamId = urlParams.get("id");

    // Filter out the current kalaam and get random 4 kalaams
    const filteredKalaam = allKalaam.filter((k) => k._id !== currentKalaamId);
    const shuffled = filteredKalaam.sort(() => 0.5 - Math.random());
    const selectedKalaam = shuffled.slice(0, 4);

    // Generate HTML for related kalaam
    const relatedContainer = document.querySelector(
      ".related-posts-section .grid"
    );
    relatedContainer.innerHTML = "";

    selectedKalaam.forEach((kalaam) => {
      // Get first line of the kalaam
      const firstLine = kalaam.ContentUrdu
        ? kalaam.ContentUrdu.split("\n")[0].trim()
        : "کلام کا متن دستیاب نہیں";

      // Truncate if too long
      const displayLine =
        firstLine.length > 30 ? firstLine.substring(0, 30) + "..." : firstLine;

      const cardHTML = `
                <a href="lyrics.html?id=${kalaam.KalaamID}" class="card">
                    <h3 class="urdu-text font-bold text-teal-700">${
                      kalaam.Title || "بلا عنوان"
                    }</h3>
                    <p class="urdu-text text-gray-600">${displayLine}</p>
                    <div class="related-post-stats">
                        <span><i class="bi bi-heart-fill"></i>${formatNumber(
                          kalaam.Likes || 2.4
                        )}k</span>
                        <span><i class="bi bi-eye-fill"></i>${formatNumber(
                          kalaam.Views || 3.2
                        )}k</span>
                    </div>
                </a>
            `;

      relatedContainer.innerHTML += cardHTML;
    });
  } catch (error) {
    console.error("Error loading related kalaam:", error);
    // Fallback to default content if API fails
    document.querySelector(".related-posts-section").innerHTML = `
            <div class="text-center py-4">
                <i class="bi bi-exclamation-triangle-fill text-yellow-500 text-2xl"></i>
                <p class="urdu-text mt-2">متعلقہ کلام لوڈ کرنے میں مسئلہ پیش آیا</p>
                <p class="urdu-text text-sm">اصل کلام دیکھنے کے لیے مرکزی صفحہ پر جائیں</p>
            </div>
        `;
  }
}

// Helper function to format numbers (1,000 => 1k)
function formatNumber(num) {
  return num >= 1000 ? (num / 1000).toFixed(1) + "k" : num;
}

// Call this function when the page loads
document.addEventListener("DOMContentLoaded", function () {
  loadRelatedKalaam();
});
