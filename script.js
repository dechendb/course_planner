// script.js
document.addEventListener('DOMContentLoaded', function() {
    const addClassBtn = document.getElementById('addClassBtn');
    const classModal = document.getElementById('classModal');
    const closeBtn = document.querySelector('.closeBtn');
    const classForm = document.getElementById('classForm');
    const deleteBtn = document.getElementById('deleteBtn');
    
    let classes = [];
    let editingClassIndex = null;

    function openModal() {
        classModal.style.display = 'block';
    }

    function closeModal() {
        classModal.style.display = 'none';
        classForm.reset();
        editingClassIndex = null;
    }

    function renderHours() {
        const hoursContainer = document.querySelector('.hours');
        hoursContainer.innerHTML = '';
        for (let i = 8; i <= 23; i++) {
            const hourDiv = document.createElement('div');
            hourDiv.classList.add('hour');
            hourDiv.textContent = i > 12 ? `${i - 12} PM` : `${i} AM`;
            hoursContainer.appendChild(hourDiv);
        }
    }

    function renderCalendar() {
        const calendar = document.querySelector('.calendar');
        calendar.innerHTML = '';
        const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

        days.forEach(day => {
            const dayDiv = document.createElement('div');
            dayDiv.classList.add('day');
            dayDiv.dataset.day = day;
            dayDiv.innerHTML = `<h3>${day}</h3>`;
            calendar.appendChild(dayDiv);
        });

        classes.forEach((classObj, index) => {
            console.log("Rendering class:", classObj);
            classObj.days.forEach(day => {
                const dayDiv = document.querySelector(`.day[data-day="${day}"]`);
                const classBlock = document.createElement('div');
                classBlock.classList.add('class-block');
                classBlock.style.backgroundColor = classObj.color;
                classBlock.style.top = `${getTopOffset(classObj.startTime)}px`;
                classBlock.style.height = `${getHeight(classObj.startTime, classObj.endTime)}px`;
                classBlock.innerText = classObj.className;
                classBlock.addEventListener('click', () => {
                    openModal();
                    fillFormWithClassData(classObj);
                    editingClassIndex = index;
                });
                dayDiv.appendChild(classBlock);
            });
        });
    }

    function getTopOffset(time) {
        const [hours, minutes] = time.split(':').map(Number);
        const offset = ((hours - 8) * 60 + minutes); // ADJUST HEIGHT
        console.log("Top offset for", time, ":", offset);
        return offset;
    }

    function getHeight(startTime, endTime) {
        const [startHours, startMinutes] = startTime.split(':').map(Number);
        const [endHours, endMinutes] = endTime.split(':').map(Number);
        const startTotalMinutes = startHours * 60 + startMinutes;
        const endTotalMinutes = endHours * 60 + endMinutes;
        const height = (endTotalMinutes - startTotalMinutes); // ADJSUT HEIGHT
        console.log("Height from", startTime, "to", endTime, ":", height);
        return height;
    }

    function fillFormWithClassData(classObj) {
        document.getElementById('className').value = classObj.className;
        document.getElementById('location').value = classObj.location;
        const daysSelect = document.getElementById('days');
        Array.from(daysSelect.options).forEach(option => {
            option.selected = classObj.days.includes(option.value);
        });
        document.getElementById('startTime').value = classObj.startTime;
        document.getElementById('endTime').value = classObj.endTime;
        document.getElementById('notes').value = classObj.notes;
        document.getElementById('color').value = classObj.color;
    }

    addClassBtn.addEventListener('click', openModal);
    closeBtn.addEventListener('click', closeModal);
    window.addEventListener('click', function(event) {
        if (event.target == classModal) {
            closeModal();
        }
    });

    classForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        const newClass = {
            className: document.getElementById('className').value,
            location: document.getElementById('location').value,
            days: Array.from(document.getElementById('days').selectedOptions).map(option => option.value),
            startTime: document.getElementById('startTime').value,
            endTime: document.getElementById('endTime').value,
            notes: document.getElementById('notes').value,
            color: document.getElementById('color').value
        };
        
        console.log("New Class:", newClass);
        
        if (editingClassIndex !== null) {
            classes[editingClassIndex] = newClass;
            console.log("Editing Class at index:", editingClassIndex);
        } else {
            classes.push(newClass);
            console.log("Added New Class to classes array.");
        }

        closeModal();
        renderCalendar();
    });

    deleteBtn.addEventListener('click', function() {
        if (editingClassIndex !== null) {
            classes.splice(editingClassIndex, 1);
            closeModal();
            renderCalendar();
        }
    });

    renderHours();
    renderCalendar();
});