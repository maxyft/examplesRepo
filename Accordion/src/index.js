import './style.less';

window.onload = () => {
  let navElements = document.querySelectorAll('.nav-list-item');
  navElements.forEach(li => {
    li.addEventListener('click', () => toggleActive(li, navElements));
  });

  let accHeaders = document.querySelectorAll('.acc-head');
  accHeaders.forEach(el => {
    el.addEventListener('click', () => {
      openSlide(el);
    });
  });
}

function toggleActive(target, elems) {
  // style toggle
  elems.forEach(active => {
    active.classList.remove('active');
  });
  target.classList.add('active');

  // accordion content toggle
  let dataId = target.dataset.id;
  if(dataId !== undefined) {
    let activeAcc = document.querySelector('.acc-content.visible');
    activeAcc.classList.remove('visible');
    activeAcc.classList.add('hidden');

    let targetAcc = document.querySelector(`.acc-content[data-id="${dataId}"]`);
    targetAcc.classList.remove('hidden');
    targetAcc.classList.add('visible');
  }
}

function openSlide(target) {
  let targetSlide = target.parentNode;
  let targetAcc = targetSlide.parentNode;
  let accId = targetAcc.dataset.id;
  let activeSlide = document.querySelector(`.acc-content[data-id="${accId}"] .acc-slide.grow`);

  activeSlide.classList.remove('grow');
  targetSlide.classList.add('grow');
}
