import { firebaseConfig } from './config/config'
import { emptyDatasAlert, successAlert, tableSort, deletePopup, closePopup } from './utils/utils'


// GLOBAL VARIABLES
let db = firebase.database()

let tableForm = document.querySelector('#reviewForm')
let hiddenId   = document.querySelector('#hiddenId')

let initials = document.querySelector('#initials')    
let regDate = document.querySelector('#regDate')   
let payment = document.querySelector('#payment')   

// CREATE DATAS
tableForm.addEventListener('submit', (e) => {
  e.preventDefault()

  if (!initials.value || !regDate.value || !payment.value) {
    emptyDatasAlert()
    return null 
  }

  let id = hiddenId.value || Date.now() 
  

  db.ref('data/' + id).set({
    initials: initials.value.trim(),
    regDate: regDate.value.trim(),
    payment: payment.value.trim(),
  })

  initials.value = ''
  regDate.value = ''
  payment.value = ''

  successAlert()
})

// READ TABLE
let tableBody = document.getElementById('table__body');
let reviewsRef = db.ref('/data');

reviewsRef.on('child_added', (data) => {
  let item = document.createElement('tr')
  item.id = data.key
  item.innerHTML = reviewTemplate(data.val())
  tableBody.appendChild(item)
})

reviewsRef.on('child_changed', (data) => {
  let reviewNode = document.getElementById(data.key)
  reviewNode.innerHTML = reviewTemplate(data.val())
})

reviewsRef.on('child_removed', (data) => {
  let reviewNode = document.getElementById(data.key)
  reviewNode.parentNode.removeChild(reviewNode)
})

tableBody.addEventListener('click', (e) => {
  let reviewNode = e.target.parentNode

  // UPDATE TABLE
  if (e.target.classList.contains('edit__btn')) {
    hiddenId.value = reviewNode.id

    initials.value = reviewNode.querySelector('.initials').innerText
    payment.value  = reviewNode.querySelector('.regDate').innerText
    regDate.value  = reviewNode.querySelector('.payment').innerText
    return false
  }

  // DELETE TABLE
  if (e.target.classList.contains('delete__btn')) {
    deletePopup()
  }

  document.querySelector('.remove__btn').onclick = () => {
    let id = reviewNode.id
    db.ref('data/' + id).remove()
    closePopup()
    return false
  }
  document.querySelector('.close__btn').onclick = closePopup

})




function getTableColumnValues(){
  var table=document.getElementsByTagName('table');
  
  console.log(table);
}
getTableColumnValues()

const reviewTemplate = ({ initials, regDate, payment }) => {

  return `
    <td class='initials'>${initials}</td>    
    <td class='regDate'>${regDate}</td>
    <td class='payment'>${payment}</td>

    <button class='delete__btn btn-outline-danger'>Удалить</button>
    <button class='edit__btn btn btn-outline-warning'>Редактировать</button>

  `
};

tableSort()

// DRAGGABLE PLUGIN
$(document).ready(function() {
    $("table").jsdragtable();
});

var Anterec;
(function (Anterec) {
    var JsDragTable = (function () {
        function JsDragTable(target) {
            this.offsetX = 5;
            this.offsetY = 5;
            this.container = target;
            this.rebind();
        }
        JsDragTable.prototype.rebind = function () {
            var _this = this;
            $(this.container).find("th").each(function (headerIndex, header) {
                $(header).off("mousedown touchstart");
                $(header).off("mouseup touchend");
                $(header).on("mousedown touchstart", function (event) {
                    _this.selectColumn($(header), event);
                });
                $(header).on("mouseup touchend", function (event) {
                    _this.dropColumn($(header), event);
                });
            });
            $(this.container).on("mouseup touchend", function () {
                _this.cancelColumn();
            });
        };

        JsDragTable.prototype.selectColumn = function (header, event) {
            var _this = this;
            event.preventDefault();
            var userEvent = new UserEvent(event);
            this.selectedHeader = header;
            var sourceIndex = this.selectedHeader.index() + 1;
            var cells = [];

            $(this.container).find("tr td:nth-child(" + sourceIndex + ")").each(function (cellIndex, cell) {
                cells[cells.length] = cell;
            });

            this.draggableContainer = $("<div/>");
            this.draggableContainer.addClass("jsdragtable-contents");
            this.draggableContainer.css({ position: "absolute", left: userEvent.event.pageX + this.offsetX, top: userEvent.event.pageY + this.offsetY });

            var dragtable = this.createDraggableTable(header);

            $(cells).each(function (cellIndex, cell) {
                var tr = $("<tr/>");
                var td = $("<td/>");
                $(td).html($(cells[cellIndex]).html());
                $(tr).append(td);
                $(dragtable).find("tbody").append(tr);
            });

            this.draggableContainer.append(dragtable);
            $("body").append(this.draggableContainer);
            $(this.container).on("mousemove touchmove", function (event) {
                _this.moveColumn($(header), event);
            });
            $(".jsdragtable-contents").on("mouseup touchend", function () {
                _this.cancelColumn();
            });
        };

        JsDragTable.prototype.moveColumn = function (header, event) {
            event.preventDefault();
            if (this.selectedHeader !== null) {
                var userEvent = new UserEvent(event);
                this.draggableContainer.css({ left: userEvent.event.pageX + this.offsetX, top: userEvent.event.pageY + this.offsetY });
            }
        };

        JsDragTable.prototype.dropColumn = function (header, event) {
            var _this = this;
            event.preventDefault();
            var sourceIndex = this.selectedHeader.index() + 1;
            var targetIndex = $(event.target).index() + 1;
            var tableColumns = $(this.container).find("th").length;

            var userEvent = new UserEvent(event);
            if (userEvent.isTouchEvent) {
                header = $(document.elementFromPoint(userEvent.event.clientX, userEvent.event.clientY));
                targetIndex = $(header).prevAll().length + 1;
            }

            if (sourceIndex !== targetIndex) {
                var cells = [];
                $(this.container).find("tr td:nth-child(" + sourceIndex + ")").each(function (cellIndex, cell) {
                    cells[cells.length] = cell;
                    $(cell).remove();
                    $(_this.selectedHeader).remove();
                });

                if (targetIndex >= tableColumns) {
                    targetIndex = tableColumns - 1;
                    this.insertCells(cells, targetIndex, function (cell, element) {
                        $(cell).after(element);
                    });
                } else {
                    this.insertCells(cells, targetIndex, function (cell, element) {
                        $(cell).before(element);
                    });
                }

                $(this.container).off("mousemove touchmove");
                $(".jsdragtable-contents").remove();
                this.draggableContainer = null;
                this.selectedHeader = null;
                this.rebind();
            }
        };

        JsDragTable.prototype.cancelColumn = function () {
            $(this.container).off("mousemove touchmove");
            $(".jsdragtable-contents").remove();
            this.draggableContainer = null;
            this.selectedHeader = null;
        };

        JsDragTable.prototype.createDraggableTable = function (header) {
            var table = $("<table/>");
            var thead = $("<thead/>");
            var tbody = $("<tbody/>");
            var tr = $("<tr/>");
            var th = $("<th/>");
            $(table).addClass($(this.container).attr("class"));
            $(table).width($(header).width());
            $(th).html($(header).html());
            $(tr).append(th);
            $(thead).append(tr);
            $(table).append(thead);
            $(table).append(tbody);
            return table;
        };

        JsDragTable.prototype.insertCells = function (cells, columnIndex, callback) {
            var _this = this;
            $(this.container).find("tr td:nth-child(" + columnIndex + ")").each(function (cellIndex, cell) {
                callback(cell, $(cells[cellIndex]));
            });
            $(this.container).find("th:nth-child(" + columnIndex + ")").each(function (cellIndex, cell) {
                callback(cell, $(_this.selectedHeader));
            });
        };
        return JsDragTable;
    })();
    Anterec.JsDragTable = JsDragTable;

    var UserEvent = (function () {
        function UserEvent(event) {
            this.event = event;
            if (event.originalEvent && event.originalEvent.touches && event.originalEvent.changedTouches) {
                this.event = event.originalEvent.touches[0] || event.originalEvent.changedTouches[0];
                this.isTouchEvent = true;
            }
        }
        return UserEvent;
    })();
})(Anterec || (Anterec = {}));
jQuery.fn.extend({
    jsdragtable: function () {
        return new Anterec.JsDragTable(this);
    }
});
