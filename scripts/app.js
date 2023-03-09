"use scrict";

let habbits = [];

const HABBIT_KEY = "HABBIT_KEY";
let globalActiveHabbitId;

/* page */
const page = {
    menu: document.querySelector('.menu__list'),
    addMenu: document.querySelector('.menu__add'),
    header: {
        h1: document.querySelector('.h1'),
        progressPercent: document.querySelector('.progress__percent'),
        progressCoverBar: document.querySelector('.progress__cover-bar')
    },
    content: {
        index: document.querySelector('.content'),
        daysContainer: document.getElementById('days'),
        nextDay: document.querySelector('.habbit__day'),
        habbit: document.querySelector('.habbit'),
        welcome: document.querySelector('.welcome')

    },
    popup: {
        cover: document.querySelector('.cover'),
        popup: document.querySelector('.popup'),
        iconField: document.querySelector('.popup__form input[name="icon"]'),
        addHabbits: document.querySelector('.popup__form button')
    }
}

/* utils */
function loadData() {
    const habbitsString = localStorage.getItem(HABBIT_KEY);
    const habbitArray = JSON.parse(habbitsString);
    if (Array.isArray(habbitArray)) {
        habbits = habbitArray;
        return true
    }
    else return false
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
    <button class="habbit__delete" onclick="deleteDay(${ind})">
        <img src="./images/delete.svg" alt="Удаление привычки" />
    </button>
</div>
`
    })
    page.content.nextDay.textContent = `День ${activeHabbit.days.length + 1}`
}

function rerender(activeHabbitId) {
    globalActiveHabbitId = activeHabbitId;
    const activeHabbit = habbits.find(habbit => habbit.id === activeHabbitId)
    if (!activeHabbitId) {
        return
    }
    rerenderMenu(activeHabbit)
    rerenderHead(activeHabbit)
    rerenderContent(activeHabbit);
}

/* Work with days */
function addDays(event) {
    event.preventDefault()

    const data = validateAndGetFormData(event.target, ['comment'])
    if (!data) {
        return
    }

    habbits = habbits.map(habbit => {
        if (habbit.id === globalActiveHabbitId) {
            habbit.days.push({ comment: data.comment })
            return habbit
        }
        return habbit
    })
    resetForm(event.target, ['comment'])
    rerender(globalActiveHabbitId)
    saveData()

}

function deleteDay(index) {
    habbits = habbits.map(habbit => {

        if (habbit.id === globalActiveHabbitId) {
            habbit.days.splice(index, 1)
            return habbit
        }
        return habbit
    })
    rerender(globalActiveHabbitId)
    saveData()
}

page.addMenu.addEventListener('click', togglePopup)

function togglePopup() {
    page.popup.cover.classList.toggle('cover_hidden')
}

page.popup.popup.addEventListener('click', function (e) {
    const btnClose = e.target.closest('.popup__close')
    if (btnClose) {
        togglePopup()
    }
});

function setIcon(context, icon) {
    page.popup.iconField.value = icon
    const activeIcon = document.querySelector('.icon.icon_active')
    activeIcon.classList.remove('icon_active')
    context.classList.add('icon_active')
}

function addHabbit(event) {
    event.preventDefault()
    page.content.habbit.classList.remove('hidden')
    page.content.welcome.classList.add('hidden')
    const data = validateAndGetFormData(event.target, ['name', 'icon', 'target'])
    if (!data) {
        return
    }
    const maxID = habbits.reduce((acc, habbit) => acc > habbit.id ? acc : habbit.id, 0)
    habbits.push({
        id: maxID + 1,
        name: data.name,
        target: data.target,
        icon: data.icon,
        days: []
    })
    resetForm(event.target, ['name', 'target'])
    togglePopup()
    saveData()
    rerender(maxID + 1);

}

function resetForm(form, fields) {
    for (const field of fields) {
        form[field].value = ''
    }

}

function validateAndGetFormData(form, fields) {
    const formData = new FormData(form)
    res = {}
    for (const field of fields) {
        const fieldValue = formData.get(field)
        form[field].classList.remove('error')
        if (!fieldValue) {
            form[field].classList.add('error')
        }
        res[field] = fieldValue
    }
    let isValid = true
    for (const field of fields) {
        if (!res[field]) {
            isValid = false
        }
    }
    if (!isValid) {
        return
    }
    return res
}

/* init */
(() => {
    const data = loadData();
    if (data) {
        page.content.habbit.classList.remove('hidden')
        page.content.welcome.classList.add('hidden')
        rerender(habbits[0].id)
    } else {
        page.content.habbit.classList.add('hidden')
        page.content.welcome.classList.remove('hidden')
    }
})();
