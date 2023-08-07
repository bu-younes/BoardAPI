

var myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");



var requestOptions = {
  method: 'GET',
  headers: myHeaders,
  redirect: 'follow'
};

fetch("http://localhost:8080/api/boards/1/cards", requestOptions)
  .then((response) => {return response.json()})
  .then((result) =>{ 

    result.cards.forEach(card =>{
    
      fetchingCard(card.card_id,card.title,card.description,card.section)

    })
  })
  .catch(error => console.log('error', error));









function fetchingCard(cardIdd,cardTitle,cardDescription,cardSection){
  const card = document.createElement('div');
      card.classList.add('kanban-task');
      card.setAttribute('draggable', 'true');

      const cardId = `card-${cardIdCounter}`;
      cardIdCounter++;

      card.innerHTML = `
        <div class="kanban-task-id">${cardIdd}</div>
        <div class="kanban-task-title">${cardTitle}</div>
        <div class="kanban-task-description">
          <p>Description:</p>
          <p>${cardDescription}</p>
        </div>
      `;

  const todo=document.getElementById('1');
  const inprogress=document.getElementById('2');
  const done=document.getElementById('3');
      if(cardSection==1){todo.appendChild(card)}

      else if((cardSection==2)){inprogress.appendChild(card)}
      else if((cardSection==3)){done.appendChild(card)}
document.getElementById('')
      // const column = document.querySelector(`.kanban-column.${cardSection}`);
      // if (column) {
      //   column.appendChild(card);
      //   card.addEventListener('dragstart', dragStart);
      //   card.addEventListener('dragend', dragEnd);
      // }

      // // Store the card element in the cardElements object
      // cardElements[cardId] = card;

      // // Clear input fields
      // document.getElementById('cardTitle').value = '';
      // document.getElementById('cardDescription').value = '';

      // // Add the new card ID to the existingCard dropdown
      // const existingCardDropdown = document.getElementById('existingCard');
      // const newOption = document.createElement('option');
      // newOption.value = cardId;
      // newOption.textContent = cardId;
      // existingCardDropdown.appendChild(newOption);
}

function createCard(){
  var myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

var raw = JSON.stringify({
  "title": document.getElementById("cardTitle").value.trim(),
  "description": document.getElementById("cardDescription").value.trim(),
  "section": document.getElementById("cardSection").value.trim()
});

var requestOptions = {
  method: 'POST',
  headers: myHeaders,
  body: raw,
  redirect: 'follow'
};

fetch("http://localhost:8080/api/boards/1/cards/"+card, requestOptions)
  .then(response => response.text())
  .then(result => console.log(result))
  .catch(error => console.log('error', error));
  location.reload()
}
const cardElements = {};

function updateBoardName() {
  const boardId = 1; 
  const newTitle = document.getElementById("newTitle").value.trim();

  if (newTitle !== "") {
    const requestBody = {
      name: newTitle
    };

    fetch(`http://localhost:8080/api/boards/${boardId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(requestBody)
    })
    .then(response => response.json())
    .then(updatedBoard => {
      document.getElementById("title").textContent = `Title: ${updatedBoard.name}`;
    })
    .catch(error => {
      console.error("Error updating board name:", error);
    });
  }
}


  const tasks = document.querySelectorAll('.kanban-task');

  tasks.forEach(task => {
    task.addEventListener('dragstart', dragStart);
    task.addEventListener('dragend', dragEnd);
  });

  const columns = document.querySelectorAll('.kanban-column');

  columns.forEach(column => {
    column.addEventListener('dragover', dragOver);
    column.addEventListener('dragenter', dragEnter);
    column.addEventListener('dragleave', dragLeave);
    column.addEventListener('drop', drop);
  });

  let draggedTask;

  function dragStart(event) {
    draggedTask = this;
    setTimeout(() => (this.style.display = 'none'), 0);
  }

  function dragEnd() {
    draggedTask.style.display = 'block';
  }

  function dragOver(event) {
    event.preventDefault();
  }

  function dragEnter(event) {
    event.preventDefault();
    this.classList.add('highlighted');
  }

  function dragLeave() {
    this.classList.remove('highlighted');
  }

  function drop() {
    this.classList.remove('highlighted');
    this.appendChild(draggedTask);
  }


  // Add a variable to keep track of card IDs
let cardIdCounter = 1;

// Update the "Create" button's event listener
// const createButton = document.querySelector('.create-button');
// createButton.addEventListener('click', createCard);

// Create a new card element
// function createCard() {
//     const cardTitle = document.getElementById('cardTitle').value;
//     const cardDescription = document.getElementById('cardDescription').value;
//     const cardSection = document.getElementById('cardSection').value;

//     if (cardTitle.trim() !== "") {
//       const card = document.createElement('div');
//       card.classList.add('kanban-task');
//       card.setAttribute('draggable', 'true');

//       const cardId = `card-${cardIdCounter}`;
//       cardIdCounter++;

//       card.innerHTML = `
//         <div class="kanban-task-id">${cardId}</div>
//         <div class="kanban-task-title">${cardTitle}</div>
//         <div class="kanban-task-description">
//           <p>Description:</p>
//           <p>${cardDescription}</p>
//         </div>
//       `;

//       const column = document.querySelector(`.kanban-column.${cardSection}`);
//       if (column) {
//         column.appendChild(card);
//         card.addEventListener('dragstart', dragStart);
//         card.addEventListener('dragend', dragEnd);
//       }

//       // Store the card element in the cardElements object
//       cardElements[cardId] = card;

//       // Clear input fields
//       document.getElementById('cardTitle').value = '';
//       document.getElementById('cardDescription').value = '';

//       // Add the new card ID to the existingCard dropdown
//       const existingCardDropdown = document.getElementById('existingCard');
//       const newOption = document.createElement('option');
//       newOption.value = cardId;
//       newOption.textContent = cardId;
//       existingCardDropdown.appendChild(newOption);
//     }

//       // Call the function to populate the dropdown
//   populateCardDropdown();
//   }

// Add a function to delete the selected card
function deleteSelectedCard() {
  const existingCardDropdown = document.getElementById('existingCard');
  const selectedCardId = existingCardDropdown.value;
  
  const cardToRemove = document.getElementById(selectedCardId);
  if (cardToRemove) {
    cardToRemove.remove();
  }
  
  // Clear the dropdown after deletion
  existingCardDropdown.value = '';
}


// Add a function to delete the selected card
function deleteSelectedCard() {
    const existingCardDropdown = document.getElementById('existingCard');
    const selectedCardId = existingCardDropdown.value;
  console.log('Selected card ID:', selectedCardId);

  const cardToRemove = cardElements[selectedCardId];
  console.log('Card to remove:', cardToRemove);

  if (cardToRemove) {
      cardToRemove.remove();
      delete cardElements[selectedCardId]; // Remove from the cardElements object

      // Remove the corresponding option from the dropdown
      existingCardDropdown.removeChild(existingCardDropdown.querySelector(`[value="${selectedCardId}"]`));
    }
  }

// This function should be called after a new card is created
function populateCardDropdown() {
  const existingCardDropdown = document.getElementById('existingCardToUpdate');
  
  // Clear existing options
  existingCardDropdown.innerHTML = '';
  
  // Add options for each card ID
  for (const cardId in cardElements) {
    const option = document.createElement('option');
    option.value = cardId;
    option.textContent = cardId;
    existingCardDropdown.appendChild(option);
  }

window.onload = function() {
  populateCardDropdown();
}
}

  // Add a function to update the selected card
function updateSelectedCard() {
  const selectedCardId = document.getElementById('existingCardToUpdate').value;
  const newTitle = document.getElementById('newControlTitle').value;
  const newDescription = document.getElementById('newControlDescription').value;

  const cardToUpdate = cardElements[selectedCardId];
  if (cardToUpdate) {
    const titleElement = cardToUpdate.querySelector('.kanban-task-title');
    const descriptionElement = cardToUpdate.querySelector('.kanban-task-description p:nth-child(2)');

    titleElement.textContent = newTitle;
    descriptionElement.textContent = newDescription;
  }

  // Clear input fields
  document.getElementById('newControlTitle').value = '';
  document.getElementById('newControlDescription').value = '';

  // Refresh the dropdown options
  populateCardDropdown();
}
