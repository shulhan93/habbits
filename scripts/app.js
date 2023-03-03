"use scrict";

let habbits = [];
const HABBIT_KEY = "HABBIT_KEY";

/* page */

const page = {
    menu: document.querySelector('.menu__list'),
    header: {
        h1: document.querySelector('.h1'),
        progressPercent: document.querySelector('.progress__percent'),
        progressCoverBar: document.querySelector('.progress__cover-bar')
    },
    content: {
        daysContainer: document.getElementById('days'),
        nextDay: document.querySelector('.habbit__day')
    }
}

/* utils */

function loadData() {
    const habbitsString = localStorage.getItem(HABBIT_KEY);
    const habbitArray = JSON.parse(habbitsString);
    if (Array.isArray(habbitArray)) {
        habbits = habbitArray;
    }
}

function saveData() {
    localStorage.setItem(HABBIT_KEY, JSON.stringify(habbits));
}

/* render */
function rerenderMenu(activeHabbit) {
    for (const habbit of habbits) {
        const existed = document.querySelector(`[menu-habbit-id="${habbit.id}"]`)
        if (!existed) {
            const element = document.createElement('button')
            element.setAttribute('menu-habbit-id', habbit.id)
            element.classList.add('btn', 'menu__item')
            element.addEventListener('click', () => rerender(habbit.id))
            element.innerHTML = `<img src="./images/${habbit.icon}.svg" alt="${habbit.name}"/>`
            if (activeHabbit.id === habbit.id) {
                element.classList.add('menu__item_active')
            }
            page.menu.appendChild(element)
            continue;
        }
        if (activeHabbit.id === habbit.id) {
            existed.classList.add('menu__item_active')
        } else {
            existed.classList.remove('menu__item_active')
        }
    }
}

function rerenderHead(activeHabbit) {
    page.header.h1.innerText = activeHabbit.name
    const progress = activeHabbit.days.length / activeHabbit.target > 1 ? 100 : activeHabbit.days.length / activeHabbit.target * 100

    page.header.progressPercent.textContent = progress.toFixed(0) + '%'
    page.header.progressCoverBar.style.width = `${progress}%`

}

function rerenderContent(activeHabbit) {
    page.content.daysContainer.innerHTML = ''

    activeHabbit.days.forEach((el, ind) => {
        page.content.daysContainer.innerHTML +=
            `
    <div class="habbit">
    <div class="habbit__day">День ${ind + 1}</div>
    <div class="habbit__comment">
      ${el.comment}
    </div>
    <button class="habbit__delete">
        <img src="./images/delete.svg" alt="Удаление привычки" />
    </button>
</div>
`
    })
    page.content.nextDay.textContent = `День ${activeHabbit.days.length + 1}`
}



function rerender(activeHabbitId) {
    if (!activeHabbitId) {
        return
    }
    const activeHabbit = habbits.find(habbit => habbit.id === activeHabbitId)
    rerenderMenu(activeHabbit)
    rerenderHead(activeHabbit)
    rerenderContent(activeHabbit);
}

/* init */
(() => {
    loadData();
    rerender(habbits[0].id)
})();
