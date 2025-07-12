async function loadPoetDetail() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  if (!id) {
    document.getElementById("poet-detail").textContent = "Invalid poet ID.";
    return;
  }

  try {
    const response = await fetch(
      `https://updated-naatacademy.onrender.com/api/writers/${id}`
    );
    const poet = await response.json();

    // Use correct field names
    const imageUrl = poet.ProfileImageURL || 'https://res.cloudinary.com/awescreative/image/upload/v1749156252/Awes/writer.svg';
    const name = poet.Name || "نام دستیاب نہیں";
    const collection = poet.GroupName || "نامعلوم گروپ";

    document.getElementById("poet-detail").innerHTML = `
      <div>
        <div class="writer-avatar-wrapper mx-auto">
          <img src="${imageUrl}" alt="${name}">
        </div>
        <div class="writer-info-text mt-4">
          <h1 class="urdu-text urdu-text-md">${name} <span class="urdu-text-sm"></span></h1>
          <p class="urdu-text urdu-text-sm text-gray-500">گروپ: ${collection}</p>
        </div>
        <button id="viewProfileBtn" class="follow-button urdu-text urdu-text-sm">پروفائل دیکھیں</button>
      </div>
    `;
  } catch (err) {
    console.error("Error loading poet detail:", err);
    document.getElementById("poet-detail").textContent = "Poet not found.";
  }
}

loadPoetDetail();
