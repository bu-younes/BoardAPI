// Fetch all cards from the server
async function fetchAllCards() {
  const boardId = 1; // Replace with your actual board ID
  const response = await fetch(`http://localhost:8080/api/boards/${boardId}/cards`);

  if (response.ok) {
    const cards = await response.json();
    return cards;
  } else {
    throw new Error('Failed to fetch cards');
  }
}

// Create a card element
function createCardElement(card) {
  const cardElement = document.createElement('div');
  cardElement.classList.add('kanban-task');
  cardElement.setAttribute('draggable', 'true');
  cardElement.innerHTML = `
    <div class="kanban-task-id">${card.card_id}</div>
    <div class="kanban-task-title">${card.title}</div>
    <div class="kanban-task-description">
      <p>Description:</p>
      <p>${card.description}</p>
    </div>
  `;
  cardElement.addEventListener('dragstart', dragStart);
  cardElement.addEventListener('dragend', dragEnd);
  return cardElement;
}

// Update the UI with fetched cards
async function updateUICards() {
  try {
    const cards = await fetchAllCards();
    const kanbanColumns = document.querySelectorAll('.kanban-column');

    kanbanColumns.forEach(column => {
      const sectionId = column.getAttribute('id');
      const sectionCards = cards.filter(card => card.section === parseInt(sectionId));
      const cardContainer = column.querySelector('.kanban-card-container');
      cardContainer.innerHTML = ''; // Clear existing cards

      sectionCards.forEach(card => {
        const cardElement = createCardElement(card);
        cardContainer.appendChild(cardElement);
      });
    });

    // Populate the "Select an Existing Card" dropdown
    populateCardDropdown(cards);
  } catch (error) {
    console.error('Error updating UI with cards:', error);
  }
}


// Update the board name
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



// Drag-and-drop functionality
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




// Card creation and management
const cardElements = {};
let cardIdCounter = 1;
let boardId = 1;

function createCard() {
  console.log("In create card");

  const cardTitle = document.getElementById('cardTitle').value;
  const cardDescription = document.getElementById('cardDescription').value;
  const cardSection = document.getElementById('cardSection').value;
  const createButton = document.querySelector('.create-button');

  createButton.disabled = true; // Disable the button

  if (cardTitle.trim() !== "") {
    const requestBody = {
      title: cardTitle,
      description: cardDescription,
      section: cardSection
    };

    fetch(`http://localhost:8080/api/boards/${boardId}/cards`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    })
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('Failed to create card');
      }
    })
    .then(createdCard => {
      // Create card element and append to column
      const card = document.createElement('div');
      card.classList.add('kanban-task');
      card.setAttribute('draggable', 'true');
      card.innerHTML = `
        <div class="kanban-task-id">${createdCard.card_id}</div>
        <div class="kanban-task-title">${createdCard.title}</div>
        <div class="kanban-task-description">
          <p>Description:</p>
          <p>${createdCard.description}</p>
        </div>
      `;

      const column = document.querySelector(`.kanban-column.section-${cardSection}`);
      if (column) {
        column.appendChild(card);
        card.addEventListener('dragstart', dragStart);
        card.addEventListener('dragend', dragEnd);
      }

      // Add card element to cardElements object
      cardElements[createdCard.card_id] = card;

      // Clear input fields
      document.getElementById('cardTitle').value = '';
      document.getElementById('cardDescription').value = '';

      // Add card ID to dropdown
      const existingCardDropdown = document.getElementById('existingCard');
      const newOption = document.createElement('option');
      newOption.value = createdCard.card_id;
      newOption.textContent = createdCard.card_id;
      existingCardDropdown.appendChild(newOption);

      populateCardDropdown();
    })
    .catch(error => {
      console.error('Error creating card:', error);
    })
    .finally(() => {
      createButton.disabled = false; // Re-enable the button
    });
  } else {
    createButton.disabled = false; // Re-enable the button if validation fails
  }
}

// Delete the selected card
function deleteSelectedCard() {
  const existingCardDropdown = document.getElementById('existingCard');
  const selectedCardId = existingCardDropdown.value;

  // Check if a card is selected
  if (!selectedCardId) {
    return;
  }

  // Replace {boardId} with the actual board ID
  const boardId = 1; // Replace with the actual board ID

  // Send a DELETE request to the API
  fetch(`http://localhost:8080/api/boards/${boardId}/cards/${selectedCardId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  })
  .then(response => {
    if (response.ok) {
      // Remove the card element from the UI
      const cardToRemove = cardElements[selectedCardId];
      if (cardToRemove) {
        cardToRemove.remove();
        delete cardElements[selectedCardId];
        existingCardDropdown.removeChild(existingCardDropdown.querySelector(`[value="${selectedCardId}"]`));
      }
    } else {
      console.error('Failed to delete card:', response.status);
    }
  })
  .catch(error => {
    console.error('Error deleting card:', error);
  });
}



// Populate card dropdown with existing cards
function populateCardDropdown() {
  const existingCardDropdown = document.getElementById('existingCardToUpdate');
  existingCardDropdown.innerHTML = '';

  for (const cardId in cardElements) {
    const option = document.createElement('option');
    option.value = cardId;
    option.textContent = cardId;
    existingCardDropdown.appendChild(option);
  }
}


// Update the selected card
function updateSelectedCard() {
  const selectedCardId = document.getElementById('existingCardToUpdate').value;
  const newTitle = document.getElementById('newControlTitle').value;
  const newDescription = document.getElementById('newControlDescription').value;
  const newSection = parseInt(document.getElementById('cardSectionn').value); // Note the change in ID here
  const requestBody = {
    title: newTitle,
    description: newDescription,
    section: newSection
  };

  const boardId = 1;

  fetch(`http://localhost:8080/api/boards/${boardId}/cards/${selectedCardId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody)
  })
  .then(response => {
    if (response.ok) {
      const cardToUpdate = cardElements[selectedCardId];
      if (cardToUpdate) {
        const titleElement = cardToUpdate.querySelector('.kanban-task-title');
        const descriptionElement = cardToUpdate.querySelector('.kanban-task-description p:nth-child(2)');
        const sectionElement = cardToUpdate.querySelector('.kanban-task-section'); // Assuming this is the element you want to update

        if (sectionElement) {
          sectionElement.textContent = `Section: ${newSection}`;
        }

        titleElement.textContent = newTitle;
        descriptionElement.textContent = newDescription;
      }

      // Move the card to the selected section by finding the appropriate container
      const targetSection = document.querySelector(`.kanban-column.section-${newSection}`);
      if (targetSection) {
        targetSection.querySelector('.kanban-card-container').appendChild(cardToUpdate);
      }

      // Clear input fields
      document.getElementById('newControlTitle').value = '';
      document.getElementById('newControlDescription').value = '';

      // Refresh the dropdown options
      populateCardDropdown();
    } else {
      console.error('Failed to update card:', response.status);
    }
  })
  .catch(error => {
    console.error('Error updating card:', error);
  });
}


// Initialize event listeners when the window loads
window.onload = function() {
  // Add event listeners only once

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

  // Populate the "Select an Existing Card" dropdown initially
  populateCardDropdown();

  // Fetch and update card data on page load
  updateUICards();
}



// Map section IDs to their corresponding values
const sectionMapping = {
  'todo': 1,
  'in-progress': 2,
  'done': 3
};

// Function to update the UI with cards
async function updateUICards() {
  try {
    const data = await fetchAllCards();
    let cards = data.cards;


    const kanbanColumns = document.querySelectorAll('.kanban-column');
    kanbanColumns.forEach(column => {
      const sectionId = column.getAttribute('id');
      const sectionValue = sectionMapping[sectionId];

      const sectionCards = cards.filter(card => card.section === sectionValue);

      const cardContainer = column.querySelector('.kanban-card-container');
      cardContainer.innerHTML = ''; // Clear existing cards

      sectionCards.forEach(card => {
        const cardElement = createCardElement(card);
        cardContainer.appendChild(cardElement);
      });
    });
  } catch (error) {
    console.error('Error updating UI with cards:', error);
  }
}

// Create a card element
function createCardElement(card) {

  const cardElement = document.createElement('div');
  cardElement.classList.add('kanban-task');
  cardElement.setAttribute('draggable', 'true');
  cardElement.innerHTML = `
    <div class="kanban-task-id">${card.card_id}</div>
    <div class="kanban-task-title">${card.title}</div>
    <div class="kanban-task-description">
      <p>Description:</p>
      <p>${card.description}</p>
    </div>
  `;
  cardElement.addEventListener('dragstart', dragStart);
  cardElement.addEventListener('dragend', dragEnd);
  return cardElement;
}

// Populate the card dropdown with existing cards
populateCardDropdown();


// Fetch and update card data on page load
updateUICards();