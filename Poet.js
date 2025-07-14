const fullAlphabet = ['ا', 'آ', 'ب', 'بھ', 'پ', 'ت', 'ث', 'ج', 'چ', 'ح', 'خ', 'د', 'ڈ', 'ذ', 'ر', 'ڑ', 'ز', 'ژ', 'س', 'ش', 'ص', 'ض', 'ط', 'ظ', 'ع', 'غ', 'ف', 'ق', 'ک', 'گ', 'ل', 'م', 'ن', 'و', 'ہ', 'ی'];

let fetchedPoetKalaam = [];  // store fetched kalaam to reuse

async function loadPoetDetail() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  if (!id) {
    document.getElementById("poet-detail").textContent = "Invalid poet ID.";
    return;
  }

  try {
    const poetResponse = await fetch(`https://updated-naatacademy.onrender.com/api/writers/${id}`);
    const poet = await poetResponse.json();

    const kalaamResponse = await fetch(`https://updated-naatacademy.onrender.com/api/kalaam`);
    const allKalaam = await kalaamResponse.json();

    fetchedPoetKalaam = allKalaam.filter(item => item.WriterName === poet.Name);

    fetchedPoetKalaam.sort((a, b) => a.Title.localeCompare(b.Title, 'ur'));

    const imageUrl = poet.ProfileImageURL || 'https://res.cloudinary.com/awescreative/image/upload/v1749156252/Awes/writer.svg';
    const name = poet.Name || "نام دستیاب نہیں";
    const collection = poet.GroupName || "نامعلوم گروپ";

    document.getElementById("poet-detail").innerHTML = `
      <div>
        <div class="writer-avatar-wrapper mx-auto">
          <img src="${imageUrl}" alt="${name}">
        </div>
        <div class="writer-info-text mt-4">
          <h1 class="urdu-text urdu-text-md">${name}</h1>
          <p class="urdu-text urdu-text-sm text-gray-500">گروپ: ${collection}</p>
        </div>
        <button id="viewProfileBtn" class="follow-button urdu-text urdu-text-sm">پروفائل دیکھیں</button>
      </div>
    `;

    // Render all kalaam initially
    renderPoetryList(fetchedPoetKalaam);

    // Build alphabet nav
    renderAlphabetNav();

  } catch (err) {
    console.error("Error loading poet detail:", err);
    document.getElementById("poet-detail").textContent = "Poet not found.";
  }
}

function renderAlphabetNav() {
  const alphabetNav = document.getElementById('alphabetNavContainer');
  alphabetNav.innerHTML = '';

  fullAlphabet.forEach(char => {
    const button = document.createElement('button');
    button.className = 'alphabet-button urdu-text urdu-text-lg';
    button.textContent = char;

    button.addEventListener('click', () => {
      const filtered = fetchedPoetKalaam.filter(item => item.Title && item.Title.startsWith(char));
      renderPoetryList(filtered);
    });

    alphabetNav.appendChild(button);
  });
}

function renderPoetryList(data) {
  const poetryListContainer = document.getElementById("poetryList");
  poetryListContainer.innerHTML = '';

  if (!data || data.length === 0) {
    poetryListContainer.innerHTML = `<p class="text-center text-gray-500 urdu-text urdu-text-base">اس شاعر کا کوئی کلام موجود نہیں۔</p>`;
    return;
  }

  let currentLetter = '';
  data.forEach(item => {
    const firstLetter = item.Title.charAt(0);
    if (firstLetter !== currentLetter) {
      currentLetter = firstLetter;
      const headerDiv = document.createElement('div');
      headerDiv.id = `letter-${currentLetter}`;
      headerDiv.className = 'poetry-section-header';
      headerDiv.innerHTML = `<span>${currentLetter}</span>`;
      poetryListContainer.appendChild(headerDiv);
    }

    const views = `${Math.floor(Math.random() * 20) + 5}K`;
    const likes = `${Math.floor(Math.random() * 10) + 1}K`;
    const badgeClass = `badge-${item.CategoryName}`;

    const itemDiv = document.createElement('div');
    itemDiv.className = 'poetry-item';
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

// load everything
loadPoetDetail();
