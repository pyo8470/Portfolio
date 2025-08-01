document.addEventListener("DOMContentLoaded", () => {
  const contentTarget = document.getElementById("person-content");
  let currentPersonId = null;
  let currentSection = "main";

  initPersonSelector("carousel");
  initNavSectionHandler();

  function loadPerson(personId) {
    currentPersonId = personId;
    fetch(`./${personId}.html`)
      .then(res => {
        if (!res.ok) throw new Error("로드 실패");
        return res.text();
      })
      .then(html => {
        contentTarget.innerHTML = html;
        showSection(currentSection); // 불러온 후 현재 섹션 보여줌
      })
      .catch(err => {
        contentTarget.innerHTML = `<p class="text-danger">[${personId}] 콘텐츠를 불러올 수 없습니다.</p>`;
        console.error(err);
      });
  }

  function showSection(sectionName) {
    currentSection = sectionName;
    const sections = contentTarget.querySelectorAll(".person-section");
    sections.forEach(section => {
      section.style.display = (section.dataset.section === sectionName) ? "block" : "none";
    });
  }

  function initPersonSelector(mode) {
    if (mode === "carousel") {
      const carousel = document.getElementById("personCarousel");
      const first = carousel.querySelector(".carousel-item.active");
      if (first) loadPerson(first.dataset.person); // 초기 로드

      carousel.addEventListener("slid.bs.carousel", () => {
        const active = carousel.querySelector(".carousel-item.active");
        if (active) loadPerson(active.dataset.person); // 선택된 사람 로드
      });
    }
  }

  function initNavSectionHandler() {
    document.querySelectorAll(".nav-link[data-section]").forEach(link => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const section = link.dataset.section;
        showSection(section);
      });
    });
  }
});
