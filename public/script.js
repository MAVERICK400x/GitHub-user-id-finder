const API_BASE_URL = "https://api.github.com/users/";
const main = document.getElementById("main");
const inputForm = document.getElementById("userInput");
const inputBox = document.getElementById("inputBox");

// Add Axios dynamically
const loadAxios = () => {
  const script = document.createElement("script");
  script.src = "https://cdnjs.cloudflare.com/ajax/libs/axios/0.21.0/axios.min.js";
  script.integrity =
    "sha512-DZqqY3PiOvTP9HkjIWgjO6ouCbq+dxqWoJZ/Q+zPYNHmlnI2dQnbJ5bxAHpAMw+LXRm4D72EIRXzvcHQtE8/VQ==";
  script.crossOrigin = "anonymous";
  document.head.appendChild(script);
};
loadAxios();

// Fetch User Data
const fetchUserData = async (username) => {
  try {
    const { data } = await axios.get(`${API_BASE_URL}${username}`);
    renderUserCard(data);
    fetchUserRepos(username);
  } catch (error) {
    if (error.response && error.response.status === 404) {
      renderError("No profile found with this username");
    } else {
      renderError("Error fetching user data");
    }
  }
};

// Fetch Repositories
const fetchUserRepos = async (username) => {
  try {
    const { data } = await axios.get(`${API_BASE_URL}${username}/repos?sort=created`);
    renderRepoCards(data);
  } catch (error) {
    renderError("Error fetching repositories");
  }
};

// Render User Card
const renderUserCard = (user) => {
  const name = user.name || user.login;
  const bio = user.bio ? `<p>${user.bio}</p>` : "";
  const cardHTML = `
    <div class="card">
      <div>
        <img src="${user.avatar_url}" alt="${name}" class="avatar">
      </div>
      <div class="user-info">
        <h2>${name}</h2>
        ${bio}
        <ul>
          <li>${user.followers} <strong>Followers</strong></li>
          <li>${user.following} <strong>Following</strong></li>
          <li>${user.public_repos} <strong>Repos</strong></li>
        </ul>
        <div id="repos"></div>
      </div>
    </div>
  `;
  main.innerHTML = cardHTML;
};

// Render Repositories
const renderRepoCards = (repos) => {
  const reposElement = document.getElementById("repos");
  reposElement.innerHTML = ""; // Clear previous repo list
  repos.slice(0, 5).forEach((repo) => {
    const repoEl = document.createElement("a");
    repoEl.classList.add("repo");
    repoEl.href = repo.html_url;
    repoEl.target = "_blank";
    repoEl.innerText = repo.name;
    reposElement.appendChild(repoEl);
  });
};

// Render Error
const renderError = (message) => {
  const errorHTML = `
    <div class="card">
      <h1>${message}</h1>
    </div>
  `;
  main.innerHTML = errorHTML;
};

// Form Submit Handler
inputForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const username = inputBox.value.trim();
  if (username) {
    fetchUserData(username);
    inputBox.value = "";
  } else {
    renderError("Please enter a valid username");
  }
});