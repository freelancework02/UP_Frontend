async function loadPoetDetail() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  if (!id) {
    document.getElementById("poet-detail").textContent = "Invalid poet ID.";
    return;
  }

  try {
    // Fetch poet details
    const poetResponse = await fetch(
      `https://updated-naatacademy.onrender.com/api/writers/${id}`
    );
    const poet = await poetResponse.json();

    // Fetch all kalaam
    const kalaamResponse = await fetch(
      "https://updated-naatacademy.onrender.com/api/kalaam"
    );
    const allKalaam = await kalaamResponse.json();

    // Filter kalaam by this poet's name
    const poetKalaam = allKalaam.filter(item => item.WriterName === poet.Name);

    // Sort kalaam by Urdu alphabet (first character of Title)
    const sortedKalaam = [...poetKalaam].sort((a, b) => {
      return a.Title.localeCompare(b.Title, 'ur');
    });

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

    // Now render the sorted kalaam
    renderPoetryList(sortedKalaam);

  } catch (err) {
    console.error("Error loading poet detail:", err);
    document.getElementById("poet-detail").textContent = "Poet not found.";
  }
}

function renderPoetryList(data, groupByLetter = true) {
  const poetryListContainer = document.getElementById("poetryList");
  poetryListContainer.innerHTML = '';
  
  if (data.length === 0) {
    poetryListContainer.innerHTML = `<p class="text-center text-gray-500 urdu-text urdu-text-base">اس شاعر کا کوئی کلام موجود نہیں۔</p>`;
    return;
  }
  
  // Group by first letter if needed
  if (groupByLetter) {
    const groupedData = {};
    data.forEach(item => {
      // Get first letter of the title (Urdu character)
      const firstLetter = item.Title.charAt(0);
      if (!groupedData[firstLetter]) {
        groupedData[firstLetter] = [];
      }
      groupedData[firstLetter].push(item);
    });

    // Sort the letters in Urdu alphabetical order
    const sortedLetters = Object.keys(groupedData).sort((a, b) => a.localeCompare(b, 'ur'));

    // Render each group
    sortedLetters.forEach(letter => {
      const headerDiv = document.createElement('div');
      headerDiv.id = `letter-${letter}`;
      headerDiv.className = 'poetry-section-header';
      headerDiv.innerHTML = `<span>${letter}</span>`;
      poetryListContainer.appendChild(headerDiv);

      // Render items for this letter
      groupedData[letter].forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'poetry-item';
        const views = `${Math.floor(Math.random() * 20) + 5}K`;
        const likes = `${Math.floor(Math.random() * 10) + 1}K`;
        const badgeClass = `badge-${item.CategoryName}`;
        
        itemDiv.innerHTML = `
          <div>
            <p class="urdu-text urdu-text-md font-medium text-slate-700 mb-1">${item.Title}</p>
            <div class="flex items-center gap-4 mt-2">
              <span class="category-badge ${badgeClass} urdu-text-xs">${item.CategoryName}</span>
              <div class="poetry-stats">
                <span class="stats-item flex items-center gap-1 urdu-text-xs">
                  <i class="bi bi-eye-fill"></i>${views}
                </span>
                <span class="stats-item flex items-center gap-1 urdu-text-xs">
                  <i class="bi bi-heart-fill"></i>${likes}
                </span>
              </div>
            </div>
          </div>
        `;
        
        poetryListContainer.appendChild(itemDiv);
      });
    });
  } else {
    // Render without grouping
    data.forEach(item => {
      const itemDiv = document.createElement('div');
      itemDiv.className = 'poetry-item';
      const views = `${Math.floor(Math.random() * 20) + 5}K`;
      const likes = `${Math.floor(Math.random() * 10) + 1}K`;
      const badgeClass = `badge-${item.CategoryName}`;
      
      itemDiv.innerHTML = `
        <div>
          <p class="urdu-text urdu-text-md font-medium text-slate-700 mb-1">${item.Title}</p>
          <div class="flex items-center gap-4 mt-2">
            <span class="category-badge ${badgeClass} urdu-text-xs">${item.CategoryName}</span>
            <div class="poetry-stats">
              <span class="stats-item flex items-center gap-1 urdu-text-xs">
                <i class="bi bi-eye-fill"></i>${views}
              </span>
              <span class="stats-item flex items-center gap-1 urdu-text-xs">
                <i class="bi bi-heart-fill"></i>${likes}
              </span>
            </div>
          </div>
        </div>
      `;
      
      poetryListContainer.appendChild(itemDiv);
    });
  }
}

loadPoetDetail();

function renderPoetryList(data, groupByLetter = true) {
  const poetryListContainer = document.getElementById("poetryList");
  poetryListContainer.innerHTML = '';
  
  if (data.length === 0) {
    poetryListContainer.innerHTML = `<p class="text-center text-gray-500 urdu-text urdu-text-base">اس شاعر کا کوئی کلام موجود نہیں۔</p>`;
    return;
  }
  
  let currentLetter = '';
  data.forEach(item => {
    if (groupByLetter && item.Letter !== currentLetter) {
      currentLetter = item.Letter;
      const headerDiv = document.createElement('div');
      headerDiv.id = `letter-${currentLetter}`;
      headerDiv.className = 'poetry-section-header';
      headerDiv.innerHTML = `<span>${currentLetter}</span>`;
      poetryListContainer.appendChild(headerDiv);
    }
    
    const itemDiv = document.createElement('div');
    itemDiv.className = 'poetry-item';
    const views = `${Math.floor(Math.random() * 20) + 5}K`;
    const likes = `${Math.floor(Math.random() * 10) + 1}K`;
    const badgeClass = `badge-${item.Type}`;
    
    itemDiv.innerHTML = `
      <div>
        <p class="urdu-text urdu-text-md font-medium text-slate-700 mb-1">${item.Title}</p>
        <div class="flex items-center gap-4 mt-2">
          <span class="category-badge ${badgeClass} urdu-text-xs">${item.CategoryName}</span>
          <div class="poetry-stats">
            <span class="stats-item flex items-center gap-1 urdu-text-xs">
              <i class="bi bi-eye-fill"></i>${views}
            </span>
            <span class="stats-item flex items-center gap-1 urdu-text-xs">
              <i class="bi bi-heart-fill"></i>${likes}
            </span>
          </div>
        </div>
      </div>
    `;
    
    poetryListContainer.appendChild(itemDiv);
  });
}



