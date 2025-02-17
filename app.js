// Replace with your actual Cloudflare Workers URL
const API_BASE = "https://simpletestapi.asimplereed.workers.dev";

let questionsList = []; // Flattened list of questions with metadata
let currentPage = 0;
const pageSize = 10; // Number of questions per page

// Store user responses: { questionId: selectedOptionIndex }
let userResponses = {};

// Fetch questions from the API and flatten the data structure
async function loadQuestions() {
  try {
    const res = await fetch(`${API_BASE}/api/getQuestions`);
    const data = await res.json();
    flattenQuestions(data);
    renderPage();
    updateProgressBar();
    updatePageInfo();
  } catch (error) {
    console.error("Error fetching questions:", error);
  }
}

// Flatten nested questions into a single array with unique IDs
function flattenQuestions(data) {
  questionsList = [];
  for (let category in data) {
    for (let subcategory in data[category]) {
      const questions = data[category][subcategory].questions;
      questions.forEach((qObj, index) => {
        const id = `${category}_${subcategory}_${index}`;
        questionsList.push({
          id,
          category,
          subcategory,
          question: qObj.question,
          options: qObj.options
        });
      });
    }
  }
}

// Render current page questions
function renderPage() {
  const container = document.getElementById("test-container");
  container.innerHTML = "";
  const start = currentPage * pageSize;
  const end = start + pageSize;
  const pageQuestions = questionsList.slice(start, end);

  pageQuestions.forEach(q => {
    const qBlock = document.createElement("div");
    qBlock.classList.add("question-block");

    const qText = document.createElement("p");
    qText.textContent = `${q.category} - ${q.subcategory}: ${q.question}`;
    qBlock.appendChild(qText);

    // Create radio buttons for options
    q.options.forEach((opt, idx) => {
      const optionDiv = document.createElement("div");
      optionDiv.classList.add("form-check");

      const radio = document.createElement("input");
      radio.classList.add("form-check-input");
      radio.type = "radio";
      radio.name = q.id;
      radio.value = idx;
      radio.id = `${q.id}_${idx}`;

      // Pre-check if user already answered this question
      if (userResponses[q.id] === idx) {
        radio.checked = true;
      }

      const label = document.createElement("label");
      label.classList.add("form-check-label", "option-label");
      label.htmlFor = `${q.id}_${idx}`;
      label.textContent = opt;

      optionDiv.appendChild(radio);
      optionDiv.appendChild(label);
      qBlock.appendChild(optionDiv);
    });

    container.appendChild(qBlock);
  });

  // Show/hide Submit button based on page
  document.getElementById("submit-container").style.display =
    currentPage >= Math.ceil(questionsList.length / pageSize) - 1 ? "block" : "none";
}

// Update progress bar based on current page
function updateProgressBar() {
  const totalPages = Math.ceil(questionsList.length / pageSize);
  const progressPercent = Math.round(((currentPage + 1) / totalPages) * 100);
  const progressBar = document.getElementById("progress-bar");
  progressBar.style.width = `${progressPercent}%`;
  progressBar.textContent = `${progressPercent}%`;
}

// Update page info text
function updatePageInfo() {
  const totalPages = Math.ceil(questionsList.length / pageSize);
  document.getElementById("page-info").textContent = `Page ${currentPage + 1} of ${totalPages}`;
}

// Collect responses from current page and store them
function storeResponses() {
  const pageQuestions = questionsList.slice(currentPage * pageSize, (currentPage + 1) * pageSize);
  pageQuestions.forEach(q => {
    const radios = document.getElementsByName(q.id);
    radios.forEach(radio => {
      if (radio.checked) {
        userResponses[q.id] = parseInt(radio.value);
      }
    });
  });
}

// Navigation functions
document.getElementById("next-btn").addEventListener("click", () => {
  storeResponses();
  if ((currentPage + 1) * pageSize < questionsList.length) {
    currentPage++;
    renderPage();
    updateProgressBar();
    updatePageInfo();
  }
});

document.getElementById("prev-btn").addEventListener("click", () => {
  storeResponses();
  if (currentPage > 0) {
    currentPage--;
    renderPage();
    updateProgressBar();
    updatePageInfo();
  }
});

// Enable/disable Prev button
function updateNavButtons() {
  document.getElementById("prev-btn").disabled = currentPage === 0;
  const totalPages = Math.ceil(questionsList.length / pageSize);
  document.getElementById("next-btn").disabled = currentPage >= totalPages - 1;
}

// Update buttons after each render
function renderPageWithNav() {
  renderPage();
  updateProgressBar();
  updatePageInfo();
  updateNavButtons();
}

// Submit the test and display the result
async function submitTest() {
  storeResponses();
  // Construct responses in expected structure from flattened questions
  let responses = {};
  // We need to group responses by category and subcategory.
  for (let qId in userResponses) {
    const parts = qId.split("_");
    const category = parts[0];
    const subcategory = parts[1];
    if (!responses[category]) responses[category] = {};
    if (!responses[category][subcategory]) responses[category][subcategory] = [];
    responses[category][subcategory].push(userResponses[qId]);
  }

  try {
    const res = await fetch(`${API_BASE}/api/scoreTest`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ responses })
    });
    const result = await res.json();
    displayResult(result);
  } catch (error) {
    console.error("Error submitting test:", error);
  }
}

function displayResult(result) {
  const resultDiv = document.getElementById("result");
  resultDiv.innerHTML = `
    <div class="card">
      <div class="card-body">
        <h2 class="card-title">Your Results</h2>
        <p class="card-text"><strong>Total Score:</strong> ${result.totalScore}</p>
        <p class="card-text"><strong>Interpretation:</strong> ${result.interpretation}</p>
        <h4 class="mt-4">Score Breakdown</h4>
        <pre>${JSON.stringify(result.scoreBreakdown, null, 2)}</pre>
      </div>
    </div>
  `;
}

// Bind the Submit button event
document.getElementById("submit-btn").addEventListener("click", submitTest);

// Initial load
loadQuestions();
