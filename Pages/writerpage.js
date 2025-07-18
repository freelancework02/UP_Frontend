function cleanText(text) {
  return text?.replace(/(<([^>]+)>)/gi, "") || "تفصیل دستیاب نہیں";
}

async function loadAllWriters() {
  try {
    const res = await fetch(`https://updated-naatacademy.onrender.com/api/Writers`);
    if (!res.ok) throw new Error("Failed to fetch writers");

    const writers = await res.json();
    console.log("Writers Data:", writers);

    const container = document.getElementById("writersGrid");
    container.innerHTML = "";

    writers.forEach(writer => {
      const card = document.createElement("article");
      card.className = "card p-5 poet-card";
      card.dataset.category = "poet";

      card.innerHTML = `
        <div class="poet-icon-container poet-icon-gradient-2">
          <img src="https://res.cloudinary.com/awescreative/image/upload/v1749156252/Awes/writer.svg" alt="Poet Icon">
        </div>
        <h5 class="urdu-text urdu-text-md font-semibold text-gray-800 poet-name">${writer.Name || "نام دستیاب نہیں"}</h5>
        <p class="urdu-text urdu-text-xs text-gray-600 mb-1 wafat wiladat">${writer.wiladat || "تاریخ دستیاب نہیں"}</p>
        <p class="urdu-text urdu-text-xs text-gray-700 leading-snug mb-4">${cleanText(writer.Bio)}</p>

        <hr class="my-3 border-gray-200">

        <div class="poet-content-section">
          <h6 class="urdu-text urdu-text-sm poet-content-heading">زمرہ</h6>
          <div class="content-list">
            <span class="urdu-text urdu-text-xs content-tag">${writer.GroupName || "زمرہ دستیاب نہیں"}</span>
          </div>
        </div>

        <div class="poet-content-section">
          <h6 class="urdu-text urdu-text-sm poet-content-heading">اشاعت</h6>
          <div class="content-list">
            <span class="urdu-text urdu-text-xs text-gray-500">${writer.CreatedOn?.split("T")[0] || "تاریخ دستیاب نہیں"}</span>
          </div>
        </div>

        <div class="stats-bar mt-3">
          <span><i class="bi bi-heart-fill text-red-500"></i> <span class="urdu-text-xs">3.8k</span></span>
          <span><i class="bi bi-eye-fill text-blue-500"></i> <span class="urdu-text-xs">4.5k</span></span>
          <a href="https://api.whatsapp.com/send?text=${encodeURIComponent(writer.Name)} - نعت اکیڈمی\n\nhttps://naatacademy.com/article.html?id=${writer.WriterID}" target="_blank" class="share-icon-button">
            <i class="bi bi-share-fill"></i>
          </a>
        </div>
      `;

      container.appendChild(card);
    });
  } catch (error) {
    console.error("Error loading writers:", error);
    document.querySelector(".writers-container").innerHTML = "<p class='text-red-600'>ڈیٹا لوڈ کرنے میں مسئلہ ہوا۔</p>";
  }
}

window.addEventListener("DOMContentLoaded", loadAllWriters);
