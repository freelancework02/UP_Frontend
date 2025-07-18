async function statusloading() {
  try {
    const res = await fetch(`https://updated-naatacademy.onrender.com/api/dashboard/stats`);
    if (!res.ok) throw new Error("Failed to fetch stats");

    const data = await res.json();
    const stats = data.stats;

    console.log("Status Data:", stats);

    // Update kalam (poetry) count
    

    // Optionally update others if needed:
    const allTab = document.querySelector('[data-tab="all"]');
    const articlesTab = document.querySelector('[data-tab="articles"]');
    const writersTab = document.querySelector('[data-tab="writers"]');
    const kalaamTab = document.querySelector('[data-tab="kalam"]');

    if (allTab) allTab.innerHTML = `تمام (${(stats.poetry + stats.articles + stats.writers) || 0})`;
    if (articlesTab) articlesTab.innerHTML = `مضامین (${stats.articles || 0})`;
    if (writersTab) writersTab.innerHTML = `شعراء (${stats.writers || 0})`;
    if (kalaamTab) kalaamTab.innerHTML = `کلام(${stats.poetry || 0})`;

  } catch (error) {
    console.error("Error loading stats:", error);
    const container = document.querySelector(".container");
    if (container)
      container.innerHTML = "<p class='text-red-600'>ڈیٹا لوڈ کرنے میں مسئلہ ہوا۔</p>";
  }
}

window.addEventListener("DOMContentLoaded", statusloading);
