# Jigsaw.io

## Project Overview

Jigsaw.io is a modern, responsive Single Page Application (SPA) designed to connect remote job seekers with exciting opportunities and help employers find top talent globally. This project serves as a comprehensive demonstration of frontend web development skills, utilizing HTML, CSS, and JavaScript, with data managed through a `db.json` file served by `json-server`.

The name "Jigsaw.io" symbolizes the mission: fitting together the right pieces – the perfect remote job with the ideal candidate.

## Features (Minimum Viable Product - MVP)

The current version of Jigsaw.io implements the following core functionalities:

- **Job Listing Display:**
  - A main page showcasing remote job listings.
  - Includes a "Aligning fragments..." indicator for a better user experience during data fetching.

- **Detailed Job View:**
  - Clicking on any job card transitions the user to a dedicated view displaying the full company description, what the company does, company logo, and an "Join Now" button.

- **Basic Job Filtering:**
  - Job seekers can filter job listings using a dropdown for specific talents/skills (e.g., "Web Development", "UI/UX", "Data Analysis").
  
- **Employer Job Submission:**
  - Employers have access to a dedicated form to submit new remote job postings.
  - The form includes fields for job title, company name, excerpt, full description, skills, job level, salary range, currency, period, and application URL.
  - Successfully submitted jobs are added to the `db.json` file via a POST request to `json-server`, demonstrating data persistence for the MVP.

## Technologies Used

- **HTML5:** For structuring the web content.
- **CSS:** For styling and ensuring a responsive and modern design.
- **JavaScript:** For all interactive functionalities, asynchronous data handling (fetch API), DOM manipulation, and SPA navigation.
- **Bootstrap 5.3.x:** A popular CSS framework used for responsive layout, navigation components, and general styling utilities.
- **Remixicon 4.5.x:** A collection of open-source vector icons used throughout the website for visual enhancements.
- **json-server:** A lightweight tool used to quickly set up a mock REST API from a `db.json` file, crucial for demonstrating data fetching and persistence in this frontend-focused project.

## Setup and Installation

To get Jigsaw.io running on your local machine, follow these steps:

### Prerequisites

- Node.js and npm (Node Package Manager) installed on your system. You can download them from [nodejs.org](https://nodejs.org/).

### Globally install json-server

Open your terminal or command prompt and run:
 json-server --watch db.json --port 3000

 **Clone this repository:**
    ```bash
    git clone [git@github.com/your-username/Jigsaw.io.git]
    cd  Jigsaw.io
    ```
   

# License
This project is open-source and available under the [MIT License]

**Author:** Cyril Katua
**Date:** June 26, 2025