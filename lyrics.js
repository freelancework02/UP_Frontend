document.addEventListener('DOMContentLoaded', function() {
    // Get the kalaam ID from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const kalaamId = urlParams.get('id');
    
    // Set current year in footer
    document.getElementById('currentYear').textContent = new Date().getFullYear();

    if (kalaamId) {
        loadKalaamDetail(kalaamId);
    } else {
        // If no ID found, show error and redirect after 3 seconds
        const container = document.getElementById('poetryTextContainer');
        container.innerHTML = `
            <div class="text-center py-8">
                <i class="bi bi-exclamation-triangle-fill text-red-500 text-4xl"></i>
                <h3 class="urdu-text text-xl mt-4">کلام کا ID نہیں ملا</h3>
                <p class="urdu-text mt-2">آپ کو 3 سیکنڈ میں مرکزی صفحہ پر ری ڈائریکٹ کیا جا رہا ہے...</p>
            </div>
        `;
        
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 3000);
    }

    // Initialize modals and other interactive elements
    initializeModals();
    initializeCoupletToggles();
    initializeCopyButtons();
    initializeShareButtons();
});

async function loadKalaamDetail(kalaamId) {
    try {
        // Show loading state
        const container = document.getElementById('poetryTextContainer');
        
        // Fetch kalaam details
        const response = await fetch(`https://updated-naatacademy.onrender.com/api/kalaam/${kalaamId}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const kalaam = await response.json();
        
        // Update the page title and header
        document.title = `${kalaam.Title} | Naat Academy`;
        document.querySelector('.kalaam-header h1').textContent = kalaam.Title;
        
        // Update meta info
        document.querySelector('.meta-info-item .meta-value.urdu-text').textContent = kalaam.WriterName || 'نامعلوم';
        document.querySelector('.bahr-value').textContent = kalaam.Bahr || 'نامعلوم';
        document.querySelector('.meta-count').textContent = kalaam.ViewCount || '0';

        // Format the content into couplets
        const urduLines = kalaam.ContentUrdu ? kalaam.ContentUrdu.split('\n') : [];
        const romanLines = kalaam.ContentEnglish ? kalaam.ContentEnglish.split('\n') : [];
        const englishLines = kalaam.ContentEnglish ? kalaam.ContentEnglish.split('\n') : [];
        
        let coupletsHTML = '';
        
        for (let i = 0; i < urduLines.length; i += 2) {
            const urduLine1 = urduLines[i] || '';
            const urduLine2 = urduLines[i+1] || '';
            const romanLine1 = romanLines[i] || 'Data dastiyab nahi hai';
            const romanLine2 = romanLines[i+1] || '';
            const englishLine1 = englishLines[i] || 'Translation not available';
            const englishLine2 = englishLines[i+1] || '';
            
            coupletsHTML += `
                <div class="couplet">
                    <p class="misra" data-ur="${urduLine1}" data-ro="${romanLine1}" data-en="${englishLine1}">${urduLine1}</p>
                    ${urduLine2 ? `<p class="misra" data-ur="${urduLine2}" data-ro="${romanLine2}" data-en="${englishLine2}">${urduLine2}</p>` : ''}
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
        
        container.innerHTML = coupletsHTML;
        
        // Initialize language toggle after content is loaded
        initializeLanguageToggle();
        
        // Reinitialize interactive elements
        initializeCoupletToggles();
        initializeCopyButtons();
        
    } catch (error) {
        console.error('Error loading kalaam details:', error);
        const container = document.getElementById('poetryTextContainer');
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

function initializeLanguageToggle() {
    const languageToggle = document.getElementById('languageToggle');
    const misraElements = document.querySelectorAll('.misra');
    const romanBoxes = document.querySelectorAll('.box-roman');
    const meaningBoxes = document.querySelectorAll('.box-meaning');

    if (languageToggle) {
        languageToggle.addEventListener('click', (e) => {
            if (e.target.classList.contains('toggle-option') && !e.target.classList.contains('active')) {
                const lang = e.target.dataset.lang;
                
                // Toggle active class
                document.querySelector('.toggle-option.active').classList.remove('active');
                e.target.classList.add('active');
                
                // Update text content
                misraElements.forEach(el => {
                    let text;
                    if (lang === 'ro') {
                        text = el.dataset.ro || 'Data dastiyab nahi hai';
                        el.classList.add('roman-text');
                        el.classList.remove('urdu-text');
                    } else {
                        text = el.dataset.ur || '';
                        el.classList.remove('roman-text');
                        el.classList.add('urdu-text');
                    }
                    el.textContent = text;
                });
                
                // Toggle visibility of translation boxes
                romanBoxes.forEach(box => box.style.display = lang === 'ro' ? 'none' : 'block');
                meaningBoxes.forEach(box => box.style.display = 'block');
            }
        });
    }
}

function initializeModals() {
    // Author modal
    const authorModal = document.getElementById('authorDetailModal');
    const authorTrigger = document.getElementById('authorBoxTrigger');
    const closeAuthorModal = document.getElementById('closeAuthorModal');
    
    if (authorModal && authorTrigger && closeAuthorModal) {
        authorTrigger.addEventListener('click', () => authorModal.style.display = 'block');
        closeAuthorModal.addEventListener('click', () => authorModal.style.display = 'none');
        window.addEventListener('click', (e) => {
            if (e.target === authorModal) authorModal.style.display = 'none';
        });
    }

    // Bahr modal
    const bahrModal = document.getElementById('bahrDetailModal');
    const bahrTrigger = document.getElementById('bahrBoxTrigger');
    const closeBahrModal = document.getElementById('closeBahrModal');
    
    if (bahrModal && bahrTrigger && closeBahrModal) {
        bahrTrigger.addEventListener('click', () => bahrModal.style.display = 'block');
        closeBahrModal.addEventListener('click', () => bahrModal.style.display = 'none');
        window.addEventListener('click', (e) => {
            if (e.target === bahrModal) bahrModal.style.display = 'none';
        });
    }
}

function initializeCoupletToggles() {
    const couplets = document.querySelectorAll('.couplet');
    couplets.forEach(couplet => {
        couplet.addEventListener('click', () => {
            couplet.classList.contains('active') ? 
                couplet.classList.remove('active') : 
                couplet.classList.add('active');
        });
    });
}

function initializeCopyButtons() {
    document.querySelectorAll('.copy-box').forEach(box => {
        box.addEventListener('click', (e) => {
            e.stopPropagation();
            const text = box.querySelector('p').innerText;
            navigator.clipboard.writeText(text).then(() => {
                box.classList.add('copied');
                setTimeout(() => box.classList.remove('copied'), 2000);
            });
        });
    });
}

function initializeShareButtons() {
    const shareButton = document.getElementById('shareButton');
    const shareBahrButton = document.getElementById('shareBahrButton');
    
    if (shareButton && navigator.share) {
        shareButton.addEventListener('click', async () => {
            try {
                await navigator.share({
                    title: document.title,
                    text: `یہ خوبصورت کلام پڑھیں: ${document.querySelector('.kalaam-header h1').textContent.trim()}`,
                    url: window.location.href,
                });
            } catch (e) {
                console.error('Share failed:', e);
            }
        });
    }
    
    if (shareBahrButton && navigator.share) {
        shareBahrButton.addEventListener('click', async () => {
            try {
                await navigator.share({
                    title: "بحرِ متدارک - Naat Academy",
                    text: "علمِ عروض میں بحرِ متدارک کے بارے میں جانیں",
                    url: "https://naat.academy/bahr/mutadarik",
                });
            } catch (e) {
                console.error('Share failed:', e);
            }
        });
    }
}

function shareKalaam() {
    if (navigator.share) {
        navigator.share({
            title: document.title,
            text: 'یہ خوبصورت کلام دیکھیں',
            url: window.location.href,
        }).catch(error => console.log('Error sharing:', error));
    } else {
        // Fallback for browsers that don't support Web Share API
        const url = window.location.href;
        const tempInput = document.createElement('input');
        tempInput.value = url;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
        
        alert('لنک کاپی ہو گیا ہے: ' + url);
    }
}

// Like button functionality
document.getElementById('likeButton')?.addEventListener('click', function() {
    const icon = this.querySelector('i');
    const countElement = this.querySelector('.count');
    let count = parseInt(countElement.dataset.initialCount, 10);
    
    this.classList.toggle('liked');
    
    if (this.classList.contains('liked')) {
        icon.classList.replace('bi-heart', 'bi-heart-fill');
        count++;
    } else {
        icon.classList.replace('bi-heart-fill', 'bi-heart');
        count--;
    }
    
    countElement.textContent = count >= 1000 ? (count/1000).toFixed(1) + 'k' : count;
});