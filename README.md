# Simple Test - Open Source Career Assessment for Indian Students

## Overview

**S: Skills** ||
**I: Interests** ||
**M: Motivations** ||
**P: Preferences** ||
**L: Leadership** ||
**E: Experience**

SIMPLE Test is an open source career assessment tool specifically designed for Indian students. Unlike many foreign-curated tests that do not reflect the unique cultural, educational, and career landscape in India, Simple Test is built from the ground up with the Indian context in mind. Developed in 2020 by Simplereed and evolving since then, this test has already helped more than 5000 students find career paths that match their personality, skills, and interests.

## The Problem

Most career assessment tests used in India are imported from abroad. These tests often:
- Fail to capture the nuances of the Indian education system and job market.
- Offer questions and results that do not resonate with Indian students.
- Lack relevance to local career opportunities and cultural values.
- Are not accessible to everyone due to high cost or limited availability.

This gap has left many Indian students with assessments that do not help them make informed career decisions, affecting their confidence and future planning.

## Our Solution

Simple Test addresses these issues by providing a free, open source, and India-specific career assessment tool that:
- Uses questions and scales tailored to the Indian context.
- Covers diverse aspects such as skills, interests, motivations, and preferences.
- Considers future trends, including the impact of AI and modern job market demands.
- Is maintained and updated regularly to stay relevant as technology and career landscapes evolve.
- Is accessible to everyone through a user-friendly web interface and API.

## Project Structure

The repository is organized as follows:

- **README.md**: This file, explaining the purpose and usage of the project.
- **LICENSE**: The open source license under which the project is released.
- **CONTRIBUTING.md**: Guidelines for contributing to the project.
- **/docs**: Additional documentation and guides for users and contributors.
- **/data**: Contains the `questions.json` file with the complete test data.
- **/src**: Source code for the web interface and API (if applicable).

## How to Use

### API Access
- The Simple Test API is deployed on Cloudflare Workers.
- Use the provided API endpoint to submit responses, calculate scores, and retrieve career recommendations.
- For example, access the endpoint:  
  `https://simpletestapi.YOUR_SUBDOMAIN.workers.dev/api/score`

### Testing the API
- A basic UI is available on GitHub Pages for testing purposes.
- This UI interacts with the API to simulate the test-taking process.

### Integration
- Developers can integrate this API into their own applications or websites.
- Detailed API documentation is available in the `/docs` folder.

### Marking Strategy
- The test employs a detailed scoring system (see [SCORING.md](SCORING.md)) where each response is assigned a numerical score.
- Scores are aggregated by category and subcategory to generate a comprehensive profile.
- This profile is then used to suggest career paths relevant to the Indian job market.

## Why This Test is Different

- **Indian Relevance**: Every question is crafted with Indian students in mind, reflecting local culture, educational practices, and career opportunities.
- **Future-Ready**: The test includes elements that prepare students for the evolving job market, including the influence of AI and digital transformation.
- **Open Source and Free**: Simple Test is completely open source. It is freely available to all students, educators, and developers who wish to use or improve it.
- **Community Driven**: We encourage educators, career counselors, and students to contribute to the test, ensuring that it continues to evolve with the needs of its users.

## How to Contribute

We welcome contributions from everyone. If you’d like to help:
- Fork the repository.
- Make your changes and improvements.
- Submit a pull request with a clear explanation of your changes.
- Follow the guidelines in CONTRIBUTING.md for consistency.

### Community Feedback

Encourage feedback from educators, career counselors, and students:
- **Open Issues:** Use GitHub Issues to collect suggestions on improving the scoring methodology.
- **Pull Requests:** Invite contributions to refine weightings or interpretation ranges based on new data or research.

## License

This project is licensed under the [Creative Commons CC0](LICENSE). By contributing, you agree that your contributions will also be under this license.

## ContactLICENSE

For questions, feedback, or further information, please contact us at:
- Email: asimplereed@gmail.com
- GitHub: [Simplereed](https://github.com/Simplereed)

## Acknowledgements

We thank all the educators, students, and contributors who have supported and benefitted from Simple Test. Your feedback and contributions are essential to our mission of empowering Indian students to make informed career decisions.

---

Simple Test is more than just a test—it is a step toward a future where every Indian student can confidently navigate their career path with a tool designed just for them.

Feel free to explore, use, and contribute to this project!
