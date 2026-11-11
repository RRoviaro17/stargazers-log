const repositoryList = document.querySelector("#repository-list");
const statusMessage = document.querySelector("#status");

function formatDate(dateString) {
  const date = new Date(`${dateString}T00:00:00`);
  return Number.isNaN(date.getTime())
    ? dateString
    : new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(date);
}

function renderRepository(repository) {
  const item = document.createElement("li");
  item.className = "repository-card";

  const heading = document.createElement("h2");
  const link = document.createElement("a");
  link.href = repository.url;
  link.textContent = repository.repository;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  heading.append(link);
  item.append(heading);

  const description = document.createElement("p");
  description.textContent = repository.description || "No description provided.";
  item.append(description);

  const metadata = document.createElement("p");
  metadata.className = "repository-meta";
  const details = [repository.language, repository.starredAt && `Starred ${formatDate(repository.starredAt)}`]
    .filter(Boolean);
  metadata.textContent = details.join(" · ");
  item.append(metadata);

  return item;
}

async function loadRepositories() {
  try {
    const response = await fetch("events.json");
    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const events = await response.json();
    const repositories = events.filter((event) => event.type === "starred");

    if (repositories.length === 0) {
      statusMessage.textContent = "No starred repositories yet.";
      return;
    }

    repositoryList.replaceChildren(...repositories.map(renderRepository));
    statusMessage.textContent = `${repositories.length} starred repositories`;
  } catch (error) {
    console.error("Could not load starred repositories:", error);
    statusMessage.textContent = "Could not load repositories. Please try again later.";
  }
}

loadRepositories();
