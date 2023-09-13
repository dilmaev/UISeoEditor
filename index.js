// Создаем XMLHttpRequest для чтения index.html
const xhr = new XMLHttpRequest();
xhr.open('GET', chrome.runtime.getURL('index.html'), true);

xhr.onreadystatechange = function () {
    if (xhr.readyState == 4) {
        const el = document.createElement('div');
        el.innerHTML = xhr.responseText;
        document.body.insertAdjacentElement('beforeend', el);
    }
}
xhr.send();


// при нажатии на кнопку добавить страницу
document.addEventListener("click", function (e) { 
    if (e.target.closest('#add_page')) {
        const menu = document.querySelector('.jquery-center-menu');
        menu.classList.toggle('active'); 
    }

    if (e.target.closest('#createPages')) {
        const menu = document.querySelector('.jquery-logs-menu');
        menu.classList.toggle('active'); 
    }
});

// активация при нажатии на кнопку M
document.addEventListener('keydown', function (e) {
    if (e.code === 'KeyM') {
        const menu = document.querySelector('.jquery-right-menu');
        menu.classList.toggle('active');

        if (!menu.classList.contains('active')) {
            // Если меню не активно, удаляем чекбоксы 
            removeCheckboxes();
        } else {
            // Если меню активно, добавляем чекбоксы
            document.querySelectorAll('h1, h2, h3, h4, h5, div, p, strong').forEach(addCheckbox);
        }
    }
});


function addCheckbox(element) {
    if (!element.closest('.jquery-right-menu') && !element.closest('.jquery-center-menu')) {
        let allText = '';
        for (let node of element.childNodes) {
            if (node.nodeType === 3) { // TEXT_NODE
                allText += node.nodeValue.trim();
            }
        }

        if (allText !== '' && allText.length > 10) {
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.className = 'custom-checkbox';
            element.insertAdjacentElement('afterbegin', checkbox);


            checkbox.addEventListener('change', function () {
                document.querySelector('.selected_checkboxes').innerHTML = '';
                // выводим выбранные чекбоксы в class selected_checkboxes
                const checkboxes = document.querySelectorAll('.custom-checkbox');
                let i = 1;
                checkboxes.forEach(function (checkbox) {
                    if (checkbox.checked) {
                        // Находим родительский элемент текущего чекбокса
                        const parentElement = checkbox.parentNode;

                        // Добавляем его HTML в selected_checkboxes
                        const selectedCheckboxes = document.querySelector('.selected_checkboxes');
                        selectedCheckboxes.insertAdjacentHTML('beforeend', `<div class="selected_items truncate"><b>${i}</b> ${parentElement.innerText}</div>`);
                        i++;
                    }
                });
            });

        }
    }
} 

// Функция для удаления чекбоксов
function removeCheckboxes() {
    document.querySelectorAll('.custom-checkbox').forEach(function (checkbox) {
        checkbox.remove();
    });
}


// свернуть развернуть меню при нажатии на кнопку
document.addEventListener("click", function (e) {
    if (e.target.id === 'hide_menu') {
        if (e.target.innerText === '+') {
            e.target.innerText = '–';
        } else {
            e.target.innerText = '+';
        }

        // Находим родительский элемент (в данном случае, div с классом "header")
        const parentDiv = e.target.parentNode;

        // Ищем следующий элемент на том же уровне
        const menu = parentDiv ? parentDiv.nextElementSibling : null;

        console.log(menu)

        if (menu) {
            menu.classList.toggle('active');
        }
    }
})


// --------------------------------------------Перетаскивание меню--------------------------------------------- //
let draggedElement = null;
let offsetX = 0;
let offsetY = 0;

document.addEventListener('mousedown', (e) => {
    if (e.target.classList.contains('header')) {
        draggedElement = e.target.closest('.jquery-right-menu, .jquery-center-menu, .jquery-logs-menu');
        const rect = draggedElement.getBoundingClientRect();
        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;
    }
});

document.addEventListener('mousemove', (e) => {
    if (draggedElement) {
        draggedElement.style.left = (e.clientX - offsetX) + 'px';
        draggedElement.style.top = (e.clientY - offsetY) + 'px';
    }
});

document.addEventListener('mouseup', () => {
    draggedElement = null;
});
// --------------------------------------------Перетаскивание меню--------------------------------------------- //