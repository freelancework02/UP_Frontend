function fixMojibake(text) {
  try {
    return decodeURIComponent(escape(text));
  } catch (e) {
    return text;
  }
}

const loadArticles = async () => {
  try {
    const res = await fetch('https://updated-naatacademy.onrender.com/api/topics');
    const articles = await res.json();
    console.log("This is articles data ", articles);

    const categoryContainer = document.getElementById('searchOptionsContainer');
    const container = document.getElementById('articles-container'); // Optional use

    // Clear existing buttons if needed
    categoryContainer.innerHTML = '';

    articles.forEach(article => {
      const slug = fixMojibake(article.Title);

      // Create category button
      const btn = document.createElement('button');
      btn.setAttribute('data-category', slug);
      btn.className = ` category-naat category-tag urdu-text-xs category-${slug} header-category-tag px-2`;
      btn.innerHTML = `
        <span class="category-name ">${slug}</span> 
        (<span class="category-post-count">${article.TopicID}</span>)
      `;
      categoryContainer.appendChild(btn);

      // Optional: display each topic as a card (for testing or extra display)
      const div = document.createElement('div');
      div.innerHTML = `<strong>${slug}</strong><p>${slug}</p>`;
      container.appendChild(div);
    });
  } catch (err) {
    console.error('Failed to load articles:', err);
  }
};


const loadIslamicEvents = async () => {
  try {
    const res = await fetch('https://naatacadmey-backend.onrender.com/api/topic'); // Replace with your actual API
    const events = await res.json();
    console.log("Islamic Events:", events);

    const container = document.getElementById('islamic-event-container');
    container.innerHTML = ''; // Clear old content if needed

    events.forEach(event => {
      const title = fixMojibake(event.topicName);
      const date = fixMojibake(event.date);
      const postCount = event.postCount || 0;

      const div = document.createElement('div');
      div.className = 'card p-4 text-center bg-rose-50 islamic-event-card';
      div.innerHTML = `
        <h5 class="urdu-text urdu-text-base font-semibold text-rose-800 islamic-event-title">${title}</h5>
        <p class="urdu-text urdu-text-xs text-gray-700 islamic-event-date">${date}</p>
        <p class="urdu-text-xs text-gray-500 mt-1">اشاعتیں: <span class="islamic-event-post-count">${postCount}</span></p>
      `;

      container.appendChild(div);
    });

  } catch (error) {
    console.error("Failed to load Islamic events:", error);
  }
};



const ArticlesList = async () => {
  try {
    const res = await fetch('https://updated-naatacademy.onrender.com/api/articles'); // Replace with your actual API
    const articles = await res.json();
    console.log("Articles:", articles);

    const container = document.getElementById('articles');
    container.innerHTML = '';

    articles.forEach(article => {
      const topicName = fixMojibake(article.Topic || 'بدون عنوان');
      const slug = fixMojibake(article.Title || '');
      const title = fixMojibake(article.Title || 'اشاعت دستیاب نہیں');
      const image = article.ThumbnailURL || "http://updated-naatacademy.onrender.com/uploads/1751805519877-923129333.png";
      const likes = article.likes || '10';
      const views = article.views || '10';

      const card = document.createElement('article');
      card.className = 'card p-4 hover:bg-amber-50 transition-colors duration-300 poetry-types-card';
      card.innerHTML = `
        <div class="flex justify-between items-center mb-3 poetry-type-title-group">
          <h3 class="text-xl urdu-text urdu-text-md font-bold text-amber-700 poetry-type-title">${topicName}</h3>
          <a href="/collection/${slug}" class="text-sm text-amber-600 hover:text-amber-800 urdu-text urdu-text-xs font-medium transition-colors poetry-type-collection-link">
            مجموعہ <i class="bi bi-arrow-left-short"></i>
          </a>
        </div>
        <img src="http://updated-naatacademy.onrender.com/uploads/1751805519877-923129333.png"
             alt="${slug} Image"
             class="w-full h-36 object-cover rounded-lg mb-3 shadow-sm poetry-type-image"
             onerror="this.onerror=null;this.src='https://placehold.co/300x150/ffecb3/8d6e63?text=Image+Missing';">
        <p class="urdu-text urdu-text-sm text-gray-700 leading-relaxed poetry-type-description">${title}</p>
        <div class="stats-bar poetry-type-stats-bar">
          <span><i class="bi bi-heart text-gray-500"></i> <span class="like-count urdu-text-xs">${likes}</span></span>
          <span><i class="bi bi-eye-fill text-blue-500"></i> <span class="view-count urdu-text-xs">${views}</span></span>
        </div>
      `;

      container.appendChild(card);
    });
  } catch (error) {
    console.error("Failed to load articles:", error);
  }
};



const kalamlist = async () => {
  try {
    const res = await fetch('https://naatacadmey-backend.onrender.com/api/topic'); // Replace with your live API
    const topics = await res.json();
    console.log("Kalam Topics:", topics);

    const container = document.getElementById('kalamlist');
    container.innerHTML = ''; // Clear old content

    topics.forEach(topic => {
      const image = topic.image || 'https://placehold.co/200x280/c5cae9/333333?text=Kalaam';
      const title = fixMojibake(topic.topicname || 'کلام'); // Note: "topicname" should match your API key

      const div = document.createElement('div');
      div.className = 'kalaam-preview-item';
      div.innerHTML = `
        <img src="${image}"
             alt="تزئین شدہ ${title}"
             class="kalaam-preview-item-image"
             onclick="document.getElementById('openKalaamModalTitle').click()">
      `;

      container.appendChild(div);
    });

  } catch (error) {
    console.error("❌ Failed to load Kalam topics:", error);
  }
};



const loadSpecialOffering = async () => {
  try {
    const res = await fetch('https://naatacadmey-backend.onrender.com/api/posts');
    const posts = await res.json();

    const wrapper = document.querySelector('#peshkashSlider .slider-wrapper');
    wrapper.innerHTML = ''; // Clear existing slides

    if (!Array.isArray(posts) || posts.length === 0) {
      console.warn("No posts found");
      return;
    }

    posts.slice(0, 7).forEach(post => {
      const lines = post.postLanguage1
        .split(/،|\n|\.|\r|!|\?|(?<=ہیں)/)
        .map(line => line.trim())
        .filter(line => line.length > 0);

      const couplet = lines.slice(0, 2).join('<br>');
      const poet = post.about || '';

      const slide = document.createElement('div');
      slide.className = 'slider-slide p-4 text-center special-offering-slide-content';
      slide.innerHTML = `
        <p class="urdu-text urdu-text-lg sm:urdu-text-xl text-gray-800 leading-loose max-w-2xl mx-auto special-offering-slide-couplet">
          ${couplet}
        </p>
        <p class="urdu-text urdu-text-xs sm:urdu-text-sm text-gray-600 block mt-3 special-offering-slide-poet">
          ${poet}
        </p>
      `;

      wrapper.appendChild(slide);
    });

    // After injecting new slides, re-init the slider
    initSlider('peshkashSlider');

  } catch (error) {
    console.error("Error loading special offering:", error);
  }
};


const loadPoets = async () => {
  try {
    const response = await fetch('https://naatacadmey-backend.onrender.com/api/writers');
    const writers = await response.json();

    if (!Array.isArray(writers) || writers.length === 0) {
      console.warn('No writers found');
      return;
    }

    const grid = document.getElementById('writergrid');
    grid.innerHTML = ''; // Clear existing content

    writers.forEach(writer => {
      const {
        writerName,
        writerYears,
        aboutWriter
      } = writer;

      // Extract plain text from HTML
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = aboutWriter || '';
      const plainTextAbout = tempDiv.innerText.trim();

      const card = `
        <article class="card p-5 poet-card transform transition-all hover:scale-105 bg-gray-50">
          <div class="poet-icon-container poet-icon-gradient-1">
            <img src="https://res.cloudinary.com/awescreative/image/upload/v1749156252/Awes/writer.svg"
              alt="Poet Icon" class="poet-icon-image">
          </div>
          <h5 class="urdu-text urdu-text-base sm:urdu-text-md font-semibold text-gray-800 poet-name">${writerName}</h5>
          <p class="urdu-text urdu-text-xs text-gray-600 mb-1 poet-lifespan">ولادت: ${writerYears || '[سال]'} - وفات: [سال]</p>
          <p class="urdu-text urdu-text-xs text-gray-700 leading-snug poet-description line-clamp-1">${plainTextAbout}</p>
          <p class="urdu-text urdu-text-xs text-green-600 mt-2 font-semibold poet-kalaam-count">کلام: 200+</p>
          <div class="stats-bar justify-center poet-stats-bar">
            <span><i class="bi bi-heart-fill text-red-500"></i> <span class="like-count urdu-text-xs">4.3k</span></span>
            <span><i class="bi bi-eye-fill text-blue-500"></i> <span class="view-count urdu-text-xs">1.9k</span></span>
          </div>
        </article>
      `;

      grid.insertAdjacentHTML('beforeend', card);
    });

  } catch (error) {
    console.error("Error fetching poets:", error);
  }
};

loadPoets();

loadSpecialOffering();


kalamlist();


ArticlesList();


loadIslamicEvents();



loadArticles();

