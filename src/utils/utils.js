// CHECKING INPUT VALUE PRESENT
export const emptyDatasAlert = () => {
    let modalWindow = document.createElement('div')
    let div = document.createElement('div')
    let p = document.createElement('p')
    let main = document.querySelector('main')

    modalWindow.classList.add('modal__window')
    div.classList.add('popup')
    p.textContent = 'Заполните все поля'
    p.classList.add('item')

    modalWindow.append(div)
    div.append(p)
    main.append(modalWindow)
  
    setTimeout(() => {
        modalWindow.remove()
    }, 2000);
}

// SUCCESS ALERT
export const successAlert = () => {

    let modalWindow = document.createElement('div')
    let div = document.createElement('div')
    let p = document.createElement('p')
    let main = document.querySelector('main')

    modalWindow.classList.add('modal__window')
    div.classList.add('popup')
    p.textContent = 'Запись добавлена'
    p.classList.add('item')

    modalWindow.append(div)
    div.append(p)
    main.append(modalWindow)
  
    setTimeout(() => {
        modalWindow.remove()
    }, 2000);
}

// CONFIRM DELETE ALERT
export const deletePopup = () => {
    
    let modalWindow = document.createElement('div')
    let div = document.createElement('div')
    let p = document.createElement('p')
    let removeButton = document.createElement('button')
    let closeButton = document.createElement('button')
    let main = document.querySelector('main')

    p.textContent = 'Удалить запись?'
    closeButton.innerHTML = '&#215;'
    removeButton.innerHTML = '&#10004;'

    modalWindow.classList.add('modal__window')
    div.classList.add('popup')
    p.classList.add('item')
    removeButton.classList.add('remove__btn')
    closeButton.classList.add('close__btn')

    modalWindow.append(div)
    div.append(p)
    div.append(removeButton)
    div.append(closeButton)
    main.append(modalWindow)
}

// REMOVING MODAL WINDOW
export const closePopup = () => {
    document.querySelector('.modal__window').remove()
}

// SORT TABLE DATAS BY NAME 
export const tableSort = () => {
    document.addEventListener('DOMContentLoaded', () => {
        const getSort = ({ target }) => {
            const order = (target.dataset.order = -(target.dataset.order || -1))
            const index = [...target.parentNode.cells].indexOf(target);
            const collator = new Intl.Collator(['en', 'ru'], { numeric: true })
            const comparator = (index, order) => (a, b) => order * collator.compare(
                a.children[index].innerHTML,
                b.children[index].innerHTML
            )
            for (const tBody of target.closest('table').tBodies) {
                tBody.append(...[...tBody.rows].sort(comparator(index, order)))
            }   
        }
        document.querySelectorAll('table .th__name').forEach(tableTH => tableTH.addEventListener('click', () => getSort(event)))
    })
}

