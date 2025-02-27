const API_BASE = "https://simpletestapi.asimplereed.workers.dev";

let allQuestions = {}; 
let questionsList = []; 
let currentPage = 0;
const pageSize = 5; 
let lastPageVisited = 0; 
let questionsByCategory = {}; 
let categoryOrder = []; 
let userResponses = {}; 

const categoryColors = {
  skills: "#4361ee",
  interests: "#3a0ca3",
  motivations: "#7209b7",
  preferences: "#f72585"
};

const categoryIcons = {
  skills: "fas fa-tools",
  interests: "fas fa-star",
  motivations: "fas fa-award",
  preferences: "fas fa-sliders-h"
};

const categoryNames = {
  skills: "Skills & Abilities",
  interests: "Interests & Passions",
  motivations: "Motivations & Values",
  preferences: "Work Style Preferences",
  cognitive: "Cognitive Skills",
  technical: "Technical Skills",
  social: "Social Skills",
  analytical: "Analytical Skills",
  realistic: "Practical Interests",
  investigative: "Investigative Interests",
  artistic: "Artistic Interests",
  social_interests: "Social Interests",
  enterprising: "Enterprising Interests",
  conventional: "Conventional Interests",
  financial_security: "Financial Security",
  social_impact: "Social Impact",
  work_life_balance: "Work-Life Balance",
  structure: "Structure & Organization",
  autonomy: "Autonomy & Independence",
  collaboration: "Collaboration & Teamwork",
  leadership: "Leadership & Management"
};

document.addEventListener("DOMContentLoaded", function() {
  showLoading(true);
  
  initApp();
  
  document.getElementById("start-test-btn").addEventListener("click", startTest);
  document.getElementById("next-btn").addEventListener("click", goToNextPage);
  document.getElementById("prev-btn").addEventListener("click", goToPrevPage);
  document.getElementById("submit-btn").addEventListener("click", submitTest);
});

// Initialize the application
async function initApp() {
  try {
    await loadQuestions();
    updateTotalQuestions();
    hideLoading();
  } catch (error) {
    console.error("Error initializing app:", error);
    showError("There was a problem loading the test. Please refresh the page and try again.");
    hideLoading();
  }
}

function showLoading(show = true) {
  document.getElementById("loading-overlay").style.display = show ? "flex" : "none";
}

function hideLoading() {
  showLoading(false);
}

function showError(message) {
  alert(message);
}

function updateTotalQuestions() {
  document.getElementById("total-questions").textContent = questionsList.length;
}

function startTest() {
  document.getElementById("intro-container").style.display = "none";
  document.getElementById("test-wrapper").style.display = "block";
  renderPage();
  updateProgressBar();
  updatePageDots();
  updateCategoryInfo();
  window.scrollTo(0, 0);
}

async function loadQuestions() {
  try {
    const res = await fetch(`${API_BASE}/api/getQuestions`);
    if (!res.ok) {
      throw new Error("Failed to fetch questions");
    }
    
    allQuestions = await res.json();
    organizeQuestions();
    createFlattenedQuestionsList();
  } catch (error) {
    console.error("Error fetching questions:", error);
    throw error;
  }
}

function organizeQuestions() {
  questionsByCategory = {};
  categoryOrder = [];
  
  for (let category in allQuestions) {
    if (!categoryOrder.includes(category)) {
      categoryOrder.push(category);
    }
    
    questionsByCategory[category] = [];
    
    for (let subcategory in allQuestions[category]) {
      const questions = allQuestions[category][subcategory].questions;
      
      questions.forEach((qObj, index) => {
        questionsByCategory[category].push({
          category,
          subcategory,
          index,
          question: qObj.question,
          options: qObj.options
        });
      });
    }
  }
}

function createFlattenedQuestionsList() {
  questionsList = [];
  
  for (let category of categoryOrder) {
    questionsByCategory[category].forEach(q => {
      const id = `${q.category}_${q.subcategory}_${q.index}`;
      questionsList.push({
        id,
        category: q.category,
        subcategory: q.subcategory,
        question: q.question,
        options: q.options
      });
    });
  }
}

function renderPage() {
  const container = document.getElementById("test-container");
  container.innerHTML = "";
  const start = currentPage * pageSize;
  const end = Math.min(start + pageSize, questionsList.length);
  const pageQuestions = questionsList.slice(start, end);

  pageQuestions.forEach((q, idx) => {
    const qBlock = document.createElement("div");
    qBlock.classList.add("question-block");
    
    const qHeader = document.createElement("div");
    qHeader.classList.add("question-header");
    
    const qNumber = document.createElement("span");
    qNumber.classList.add("question-number");
    qNumber.textContent = start + idx + 1;
    qNumber.style.backgroundColor = categoryColors[q.category] || "#4361ee";
    
    const qText = document.createElement("h4");
    qText.classList.add("question-text");
    qText.textContent = q.question;
    
    qHeader.appendChild(qNumber);
    qHeader.appendChild(qText);
    qBlock.appendChild(qHeader);

    const optionsContainer = document.createElement("div");
    optionsContainer.classList.add("options-container");
    
    q.options.forEach((opt, optIdx) => {
      const optionDiv = document.createElement("div");
      optionDiv.classList.add("option-item");
      
      const radio = document.createElement("input");
      radio.classList.add("option-input");
      radio.type = "radio";
      radio.name = q.id;
      radio.value = optIdx;
      radio.id = `${q.id}_${optIdx}`;
      
      if (userResponses[q.id] === optIdx) {
        radio.checked = true;
        optionDiv.classList.add("selected");
      }
      
      const label = document.createElement("label");
      label.classList.add("option-label");
      label.htmlFor = `${q.id}_${optIdx}`;
      label.textContent = opt;
      
      optionDiv.addEventListener("click", function() {
        const allOptions = optionsContainer.querySelectorAll(".option-item");
        allOptions.forEach(o => o.classList.remove("selected"));
        
        optionDiv.classList.add("selected");
        
        radio.checked = true;
        
        userResponses[q.id] = optIdx;
      });
      
      optionDiv.appendChild(radio);
      optionDiv.appendChild(label);
      optionsContainer.appendChild(optionDiv);
    });
    
    qBlock.appendChild(optionsContainer);
    container.appendChild(qBlock);
  });

  updateNavButtons();
}

function goToNextPage() {
  if (currentPage < getTotalPages() - 1) {
    currentPage++;
    lastPageVisited = Math.max(lastPageVisited, currentPage);
    
    renderPage();
    updateProgressBar();
    updatePageDots();
    updateCategoryInfo();
    window.scrollTo(0, 0);
  }
}

function goToPrevPage() {
  if (currentPage > 0) {
    currentPage--;
    renderPage();
    updateProgressBar();
    updatePageDots();
    updateCategoryInfo();
    window.scrollTo(0, 0);
  }
}

function updateNavButtons() {
  const prevBtn = document.getElementById("prev-btn");
  const nextBtn = document.getElementById("next-btn");
  const submitContainer = document.getElementById("submit-container");
  
  prevBtn.disabled = currentPage === 0;
  
  const isLastPage = currentPage === getTotalPages() - 1;
  nextBtn.style.display = isLastPage ? "none" : "block";
  submitContainer.style.display = isLastPage ? "block" : "none";
}

function getTotalPages() {
  return Math.ceil(questionsList.length / pageSize);
}

function updateProgressBar() {
  const totalQuestions = questionsList.length;
  const answeredCount = Object.keys(userResponses).length;
  const progressPercentage = Math.round((answeredCount / totalQuestions) * 100);
  
  document.getElementById("progress-bar").style.width = `${progressPercentage}%`;
  document.getElementById("progress-bar").setAttribute("aria-valuenow", progressPercentage);
  document.getElementById("questions-complete").textContent = `${answeredCount}/${totalQuestions}`;
  document.getElementById("progress-percentage").textContent = `${progressPercentage}%`;
}

function updateCategoryInfo() {
  const start = currentPage * pageSize;
  const currentQuestion = questionsList[start];
  
  if (currentQuestion) {
    const categoryBadge = document.getElementById("current-category-badge");
    const categoryHeading = document.getElementById("current-category");
    const subcategoryText = document.getElementById("current-subcategory");
    
    categoryBadge.textContent = formatCategoryName(currentQuestion.category);
    categoryBadge.style.backgroundColor = categoryColors[currentQuestion.category];
    categoryHeading.textContent = categoryNames[currentQuestion.category] || formatCategoryName(currentQuestion.category);
    subcategoryText.textContent = categoryNames[currentQuestion.subcategory] || formatCategoryName(currentQuestion.subcategory);
  }
}

function updatePageDots() {
  const dotsContainer = document.getElementById("page-indicator");
  dotsContainer.innerHTML = "";
  
  const totalPages = getTotalPages();
  const maxDots = 7; // Maximum dots to show
  
  let startDot = Math.max(0, currentPage - 2);
  let endDot = Math.min(totalPages - 1, startDot + maxDots - 1);
  
  if (endDot - startDot < maxDots - 1) {
    startDot = Math.max(0, endDot - maxDots + 1);
  }
  
  for (let i = 0; i < totalPages; i++) {
    if (i === startDot && startDot > 0) {
      const ellipsis = document.createElement("span");
      ellipsis.classList.add("page-dot", "ellipsis");
      ellipsis.textContent = "...";
      dotsContainer.appendChild(ellipsis);
    }
    
    if (i >= startDot && i <= endDot) {
      const dot = document.createElement("span");
      dot.classList.add("page-dot");
      
      if (i === currentPage) {
        dot.classList.add("active");
      } else if (i <= lastPageVisited) {
        dot.classList.add("visited");
      }
      
      if (i <= lastPageVisited) {
        dot.addEventListener("click", () => {
          currentPage = i;
          renderPage();
          updateProgressBar();
          updatePageDots();
          updateCategoryInfo();
          window.scrollTo(0, 0);
        });
      }
      
      dotsContainer.appendChild(dot);
    }
    
    if (i === endDot && endDot < totalPages - 1) {
      const ellipsis = document.createElement("span");
      ellipsis.classList.add("page-dot", "ellipsis");
      ellipsis.textContent = "...";
      dotsContainer.appendChild(ellipsis);
    }
  }
}

function formatCategoryName(name) {
  return name.split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

async function submitTest() {
  const answeredCount = Object.keys(userResponses).length;
  const totalQuestions = questionsList.length;
  const attemptPercentage = (answeredCount / totalQuestions) * 100;

  if (attemptPercentage < 90) {
    showLoading(false);
    const resultContainer = document.getElementById("result");
    resultContainer.innerHTML = `
<div class="card shadow-sm mb-4 bg-dark text-white">
  <div class="card-body text-center p-5">
    <h2 class="mb-4"><i class="fas fa-poo-storm"></i> Epic PUBG Wala Detected! 🎮</h2>
    <div class="roasting-content">
      <p class="lead">${answeredCount} answers? Who are you fooling? Do you have a mirror nearby? 😆</p>

      <div class="alert alert-warning text-dark">
        <h4><i class="fas fa-radiation"></i> Read it aloud:</h4>
        <ul class="text-left">
          <li>At least ${Math.round(answeredCount/2)+1} serious students could have taken the test. 😒</li>
          <li>Your parents are one step closer to realizing that they have a dumb kid at home. 😢</li>
          <li>You just prove what people have been saying: if you give something away for free, people won't respect it. 🤦‍♂️</li>
          <li>Your performance is so bad, even the server is taking a nap! 😴</li>
          <li>Your brain is buffering on 2G – even dial-up makes a comeback! 📞</li>
          <li>Your focus is so lacking that even Shukla aunty's gossip grabs more attention! ☕</li>
          <li>Your effort is so half-baked that even my ex put in more effort to save our relationship! 🎩</li>
        </ul>
      </div>

      <div class="row mt-4">
        <div class="col-md-6 mb-3">
          <div class="card bg-danger">
            <div class="card-body">
              <h5><i class="fas fa-sad-tear"></i> Reality Check</h5>
              <p>Your attention span makes Insta reels look like a PhD dissertation. 🤯</p>
              <p class="small">Fun fact: Even a donkey has better focus! 🐴</p>
            </div>
          </div>
        </div>
        <div class="col-md-6">
          <div class="card bg-success">
            <div class="card-body">
              <h5><i class="fas fa-lightbulb"></i> Pro Tip</h5>
              <p>Next time, actually answer the questions – don’t swipe like you’re on a dating app! 📱</p>
              <p class="small">(We both know you'll just scroll through memes 😜)</p>
            </div>
          </div>
        </div>
      </div>

      <hr class="bg-white">
      
      <div class="mt-4">
        <h4><i class="fas fa-skull-crossbones"></i> Final Warning</h4>
        <p>Either:</p>
        <div class="d-flex justify-content-center gap-3">
          <button class="btn btn-outline-light me-3" onclick="window.location.reload()">
            <i class="fas fa-redo"></i> Try Properly
          </button>
          <button class="btn btn-outline-warning" onclick="window.open('https://youtu.be/IxX_QHay02M')">
            <i class="fab fa-youtube"></i> Watch Brainrot Videos
          </button>
        </div>
        <p class="mt-3 small">We know which one you'll pick... 😏</p>
      </div>
    </div>
  </div>
</div>
    `;
    document.getElementById("test-wrapper").style.display = "none";
    document.getElementById("result").style.display = "block";
    return;
  }

  if (answeredCount < totalQuestions) {
    const unansweredCount = totalQuestions - answeredCount;
    if (!confirm(`You have ${unansweredCount} unanswered questions. Submit anyway?`)) return;
  }

  showLoading(true);

  try {
    const organizedResponses = {};
    for (let category of categoryOrder) {
      organizedResponses[category] = {};
      for (let q of questionsByCategory[category]) {
        const id = `${q.category}_${q.subcategory}_${q.index}`;
        organizedResponses[category][q.subcategory] = organizedResponses[category][q.subcategory] || [];
        organizedResponses[category][q.subcategory].push(
          userResponses[id] ?? Math.floor(q.options.length / 2)
        );
      }
    }

const response = await fetch(`${API_BASE}/api/scoreTest`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ 
    responses: organizedResponses,
    questions: allQuestions  
  })
});

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Server responded with ${response.status}: ${errorText}`);
    }

    const results = await response.json();
    
    renderResults(results);
    
    document.getElementById("test-wrapper").style.display = "none";
    document.getElementById("result").style.display = "block";
    window.scrollTo(0, 0);

  } catch (error) {
    console.error("Submission error:", error);
    
    const errorMessage = error.message.includes("Failed to fetch") 
      ? "Network error - Check your internet connection"
      : error.message.includes("Server responded")
      ? `Server error: ${error.message}`
      : "Error processing results - Invalid response format";

    showError(errorMessage);
    
  } finally {
    hideLoading();
  }
}

function showError(message) {
  const errorHTML = `
    <div class="card border-danger mb-4">
      <div class="card-body text-center text-danger">
        <h3><i class="fas fa-bug"></i> Oops! Bandwidth Bottleneck</h3>
        <p class="mb-1">${message}</p>
        <small>Trust me, It works 99% of the time.</small>
        <small>This test is hosted on free plan, You know how it works!!</small>
        <div class="mt-3">
          <button class="btn btn-outline-danger" onclick="window.location.reload()">
            <i class="fas fa-sync-alt"></i> Try Again
          </button>
        </div>
      </div>
    </div>
  `;
  
  const resultContainer = document.getElementById("result");
  resultContainer.innerHTML = errorHTML;
  resultContainer.style.display = "block";
  document.getElementById("test-wrapper").style.display = "none";
}
function renderResults(results) {
  const resultContainer = document.getElementById("result");
  resultContainer.innerHTML = "";
  
  const header = document.createElement("div");
  header.classList.add("text-center", "mb-5");
  
  const heading = document.createElement("h2");
  heading.classList.add("display-4", "mb-3");
  heading.textContent = "Your Career Profile";
  
  const subheading = document.createElement("p");
  subheading.classList.add("lead");
  subheading.textContent = `Overall Match: ${results.overallPercentage}%`;
  
  header.appendChild(heading);
  header.appendChild(subheading);
  resultContainer.appendChild(header);
  
  const resultsContent = document.createElement("div");
  resultsContent.classList.add("row");
  
  const scoreCol = document.createElement("div");
  scoreCol.classList.add("col-lg-4", "mb-4");
  
  const scoreCard = document.createElement("div");
  scoreCard.classList.add("card", "h-100", "shadow-sm");
  
  const scoreHeader = document.createElement("div");
  scoreHeader.classList.add("card-header", "bg-primary", "text-white");
  scoreHeader.innerHTML = '<h3 class="mb-0">Score Summary</h3>';
  
  const scoreBody = document.createElement("div");
  scoreBody.classList.add("card-body");
  
  for (let category in results.categoryScores) {
    const categoryScore = results.categoryScores[category];
    
    const categoryDiv = document.createElement("div");
    categoryDiv.classList.add("category-score", "mb-4");
    
    const categoryLabel = document.createElement("div");
    categoryLabel.classList.add("d-flex", "justify-content-between", "mb-1");
    
    const nameSpan = document.createElement("span");
    nameSpan.classList.add("category-name");
    nameSpan.innerHTML = `<i class="${categoryIcons[category] || 'fas fa-check'}"></i> ${categoryNames[category] || formatCategoryName(category)}`;
    
    const valueSpan = document.createElement("span");
    valueSpan.classList.add("category-value");
    valueSpan.textContent = `${categoryScore.percentage}%`;
    
    categoryLabel.appendChild(nameSpan);
    categoryLabel.appendChild(valueSpan);
    
    const progressContainer = document.createElement("div");
    progressContainer.classList.add("progress");
    
    const progressBar = document.createElement("div");
    progressBar.classList.add("progress-bar");
    progressBar.style.width = `${categoryScore.percentage}%`;
    progressBar.style.backgroundColor = categoryColors[category];
    progressBar.setAttribute("role", "progressbar");
    progressBar.setAttribute("aria-valuenow", categoryScore.percentage);
    progressBar.setAttribute("aria-valuemin", "0");
    progressBar.setAttribute("aria-valuemax", "100");
    
    progressContainer.appendChild(progressBar);
    categoryDiv.appendChild(categoryLabel);
    categoryDiv.appendChild(progressContainer);
    scoreBody.appendChild(categoryDiv);
  }
  
  scoreCard.appendChild(scoreHeader);
  scoreCard.appendChild(scoreBody);
  scoreCol.appendChild(scoreCard);
  resultsContent.appendChild(scoreCol);
  
  const strengthsCol = document.createElement("div");
  strengthsCol.classList.add("col-lg-8", "mb-4");
  
  const strengthsCard = document.createElement("div");
  strengthsCard.classList.add("card", "h-100", "shadow-sm");
  
  const strengthsHeader = document.createElement("div");
  strengthsHeader.classList.add("card-header", "bg-success", "text-white");
  strengthsHeader.innerHTML = '<h3 class="mb-0">Your Strengths & Career Matches</h3>';
  
  const strengthsBody = document.createElement("div");
  strengthsBody.classList.add("card-body");
  
  const strengthsSection = document.createElement("div");
  strengthsSection.classList.add("mb-4");
  
  const strengthsTitle = document.createElement("h4");
  strengthsTitle.classList.add("mb-3");
  strengthsTitle.innerHTML = '<i class="fas fa-award mr-2"></i>Your Top Strengths';
  
  const strengthsList = document.createElement("div");
  strengthsList.classList.add("strengths-list");
  
  if (results.strengths && results.strengths.length > 0) {
    results.strengths.forEach(strength => {
      const strengthItem = document.createElement("div");
      strengthItem.classList.add("strength-item");
      
      let strengthText = '';
      if (strength.type === "category") {
        strengthText = strength.name;
      } else {
        strengthText = `${strength.name} (${strength.category})`;
      }
      
      strengthItem.innerHTML = `
        <span class="strength-score">${strength.score}%</span>
        <span class="strength-name">${strengthText}</span>
      `;
      
      strengthsList.appendChild(strengthItem);
    });
  } else {
    strengthsList.innerHTML = '<p>No specific strengths identified.</p>';
  }
  
  strengthsSection.appendChild(strengthsTitle);
  strengthsSection.appendChild(strengthsList);
  strengthsBody.appendChild(strengthsSection);
  
  const careersSection = document.createElement("div");
  
  const careersTitle = document.createElement("h4");
  careersTitle.classList.add("mb-3");
  careersTitle.innerHTML = '<i class="fas fa-briefcase mr-2"></i>Recommended Career Paths';
  
  const careersList = document.createElement("div");
  careersList.classList.add("careers-list");
  
  if (results.recommendations && results.recommendations.length > 0) {
    results.recommendations.forEach(rec => {
      const careerItem = document.createElement("div");
      careerItem.classList.add("career-item", "mb-3");
      
      const careerHeader = document.createElement("div");
      careerHeader.classList.add("d-flex", "justify-content-between", "align-items-center", "mb-2");
      
      const careerName = document.createElement("h5");
      careerName.classList.add("career-name", "mb-0");
      careerName.textContent = rec.field;
      
      const matchBadge = document.createElement("span");
      matchBadge.classList.add("match-badge");
      matchBadge.textContent = `${rec.match}% Match`;
      
      careerHeader.appendChild(careerName);
      careerHeader.appendChild(matchBadge);
      
      const careerOptions = document.createElement("ul");
      careerOptions.classList.add("career-options");
      
      rec.careers.forEach(career => {
        const careerOption = document.createElement("li");
        careerOption.textContent = career;
        careerOptions.appendChild(careerOption);
      });
      
      careerItem.appendChild(careerHeader);
      careerItem.appendChild(careerOptions);
      careersList.appendChild(careerItem);
    });
  } else {
    careersList.innerHTML = '<p>No specific career recommendations available.</p>';
  }
  
  careersSection.appendChild(careersTitle);
  careersSection.appendChild(careersList);
  strengthsBody.appendChild(careersSection);
  
  strengthsCard.appendChild(strengthsHeader);
  strengthsCard.appendChild(strengthsBody);
  strengthsCol.appendChild(strengthsCard);
  resultsContent.appendChild(strengthsCol);
  
  const interpretationRow = document.createElement("div");
  interpretationRow.classList.add("row", "mt-2");
  
  const interpretationCol = document.createElement("div");
  interpretationCol.classList.add("col-12");
  
  const interpretationCard = document.createElement("div");
  interpretationCard.classList.add("card", "shadow-sm");
  
  const interpretationHeader = document.createElement("div");
  interpretationHeader.classList.add("card-header", "bg-info", "text-white");
  interpretationHeader.innerHTML = '<h3 class="mb-0">Personalized Insights</h3>';
  
  const interpretationBody = document.createElement("div");
  interpretationBody.classList.add("card-body");
  
  const interpretation = document.createElement("p");
  interpretation.classList.add("interpretation-text");
  interpretation.textContent = results.interpretation || "No personalized insights available.";
  
  interpretationBody.appendChild(interpretation);
  interpretationCard.appendChild(interpretationHeader);
  interpretationCard.appendChild(interpretationBody);
  interpretationCol.appendChild(interpretationCard);
  interpretationRow.appendChild(interpretationCol);
  
  const vizRow = document.createElement("div");
  vizRow.classList.add("row", "mt-4");
  
  const vizCol = document.createElement("div");
  vizCol.classList.add("col-12");
  
  const vizCard = document.createElement("div");
  vizCard.classList.add("card", "shadow-sm");
  
  const vizHeader = document.createElement("div");
  vizHeader.classList.add("card-header", "bg-info", "text-white");
  vizHeader.innerHTML = '<h3 class="mb-0">Score Breakdown</h3>';
  
  const vizBody = document.createElement("div");
  vizBody.classList.add("card-body");
  
  const canvasContainer = document.createElement("div");
  canvasContainer.classList.add("chart-container");
  canvasContainer.style.height = "400px";
  
  const canvas = document.createElement("canvas");
  canvas.id = "resultsChart";
  
  canvasContainer.appendChild(canvas);
  vizBody.appendChild(canvasContainer);
  vizCard.appendChild(vizHeader);
  vizCard.appendChild(vizBody);
  vizCol.appendChild(vizCard);
  vizRow.appendChild(vizCol);
  
  resultContainer.appendChild(resultsContent);
  resultContainer.appendChild(interpretationRow);
  resultContainer.appendChild(vizRow);
  
  createResultsChart(results, canvas);
}

function createResultsChart(results, canvas) {
  const categories = Object.keys(results.categoryScores);
  const scores = categories.map(cat => results.categoryScores[cat].percentage);
  
  const backgroundColors = categories.map(cat => {
    const color = categoryColors[cat] || "#4361ee";
    return `${color}80`; 
  });
  
  const borderColors = categories.map(cat => categoryColors[cat] || "#4361ee");
  
  new Chart(canvas, {
    type: 'radar',
    data: {
      labels: categories.map(cat => categoryNames[cat] || formatCategoryName(cat)),
      datasets: [{
        label: 'Your Profile',
        data: scores,
        backgroundColor: backgroundColors[0] || 'rgba(67, 97, 238, 0.5)',
        borderColor: borderColors[0] || 'rgb(67, 97, 238)',
        borderWidth: 2
      }]
    },
    options: {
      maintainAspectRatio: false,
      scales: {
        r: {
          angleLines: {
            display: true
          },
          suggestedMin: 0,
          suggestedMax: 100
        }
      },
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: 'Your Category Scores'
        }
      }
    }
  });
}