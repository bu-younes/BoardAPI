
let hostname = window.location.hostname;
const base_url = "http://"+hostname+":8080";
// Fetch all cards from the server
async function fetchAllCards() {
  const boardId = 1; // Replace with your actual board ID
  const response = await fetch(base_url+`/api/boards/${boardId}/cards`);

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

    fetch(base_url+`/api/boards/${boardId}`, {
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

// Fetch the initial board title and populate it
function fetchInitialBoardTitle() {
  const boardId = 1; // Adjust the board ID as needed
  fetch(base_url+`/api/boards/${boardId}`)
    .then(response => response.json())
    .then(board => {
      document.getElementById("title").textContent = `Title: ${board.name}`;
    })
    .catch(error => {
      console.error("Error fetching initial board title:", error);
    });
}

// Call the function to fetch and populate the initial board title
fetchInitialBoardTitle();




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

// Drop function for drag-and-drop
function drop(event) {
  event.preventDefault();
  this.classList.remove('highlighted');
  this.appendChild(draggedTask);

  // Update card section on the server
  const cardId = draggedTask.querySelector('.kanban-task-id').textContent.split('-')[1]; // Extract card ID
  const newSectionId = this.getAttribute('id');

  updateCardSectionOnServer(cardId, newSectionId)
    .then(() => {
      // Update the UI after successful server update
      updateUICards();
      window.location.reload(); // Reload the page
    })
    .catch(error => {
      console.error('Error updating card section:', error);
      // Handle error if needed
    });
}

// Function to update card section on the server
async function updateCardSectionOnServer(cardId, newSectionId) {
  const boardId = 1; // Replace with your actual board ID

  const requestBody = {
    section: sectionMapping[newSectionId] // Convert section ID to section value
  };

  try {
    const response = await fetch(base_url+`/api/boards/${boardId}/cards/${cardId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      throw new Error('Failed to update card section');
    }
  } catch (error) {
    throw new Error('Error updating card section: ' + error.message);
  }
}


// Card creation and management
const cardElements = {};
let cardIdCounter = 1;
let boardId = 1;

function createCard() {
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

    fetch(base_url+`/api/boards/${boardId}/cards`, {
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
        <div class="kanban-task-id">card-${createdCard.card_id}</div>
        <div class="kanban-task-title">
          <p>Title:</p>
          <p>${createdCard.title}</p>
        </div>
        <div class="kanban-task-description">
          <p>Description:</p>
          <p>${createdCard.description}</p>
        </div>
      `;
        // Auto-refresh the page after updating the card
        window.location.reload();

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
      newOption.textContent = `card-${createdCard.card_id}`;
      existingCardDropdown.appendChild(newOption);

      // Re-enable the button
      createButton.disabled = false;
    })
    .catch(error => {
      console.error('Error creating card:', error);
      createButton.disabled = false; // Re-enable the button if an error occurs
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
  fetch(base_url+`/api/boards/${boardId}/cards/${selectedCardId}`, {
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
      
      // Auto-refresh the page after updating the card
      window.location.reload();
    } else {
      console.error('Failed to delete card:', response.status);
    }
  })
  .catch(error => {
    console.error('Error deleting card:', error);
  });
}



function populateCardDropdown(cards) {
  const existingCardDropdown = document.getElementById('existingCard');
  const existingCardToUpdateDropdown = document.getElementById('existingCardToUpdate');
  
  existingCardDropdown.innerHTML = '';
  existingCardToUpdateDropdown.innerHTML = ''; // Clear the dropdown content
  
  for (const cardId in cardElements) {
    const option1 = document.createElement('option'); // Create a new option element
    option1.value = cardId;
    option1.textContent = `card-${cardId}`;
    existingCardDropdown.appendChild(option1);

    const option2 = document.createElement('option'); // Create a new option element
    option2.value = cardId;
    option2.textContent = `card-${cardId}`;
    existingCardToUpdateDropdown.appendChild(option2);
  }

  // If cards parameter is provided, populate the dropdown with card IDs
  //if (cards) {
 //   for (const card of cards) {
   //   const option = document.createElement('option');
    //  option.value = card.card_id;
    //  option.textContent = `card-${card.card_id}`;
     // existingCardDropdown.appendChild(option);
   // }
 // }
}




// Update the selected card
function updateSelectedCard() {
  const selectedCardId = document.getElementById('existingCardToUpdate').value;
  const newTitle = document.getElementById('newControlTitle').value;
  const newDescription = document.getElementById('newControlDescription').value;
  const newSection = parseInt(document.getElementById('cardSectionn').value);
  const requestBody = {
    title: newTitle,
    description: newDescription,
    section: newSection
  };

  const boardId = 1;

  fetch(base_url+`/api/boards/${boardId}/cards/${selectedCardId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody)
  })
  .then(response => {
    if (response.ok) {
      // Update card details and move card to new section as before

      // Clear input fields
      document.getElementById('newControlTitle').value = '';
      document.getElementById('newControlDescription').value = '';

      // Refresh the dropdown options
      populateCardDropdown();

      // Auto-refresh the page after updating the card
      window.location.reload();
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

// Update the UI with fetched cards
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
        cardElements[card.card_id] = cardElement; // Store card element in cardElements
      });
    });

    // Populate the "Select an Existing Card" dropdown
    populateCardDropdown(cards);
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
    <div class="kanban-task-id">card-${card.card_id}</div>
    <div class="kanban-task-title">
          <p>Title:</p>
          <p>${card.title}</p>
          </div>
    <div class="kanban-task-description">
      <p>Description:</p>
      <p>${card.description}</p>
    </div>
  `;
  cardElement.addEventListener('dragstart', dragStart);
  cardElement.addEventListener('dragend', dragEnd);
  return cardElement;
}

//
// Populate the card dropdown with existing cards
populateCardDropdown();


// Fetch and update card data on page load
updateUICards();