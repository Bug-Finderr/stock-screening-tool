# Stock Screening Tool

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Application](#running-the-application)
  - [Building for Production](#building-for-production)
- [Usage](#usage)
  - [Sample Queries](#sample-queries)
- [Contributing](#contributing)
- [License](#license)

## Overview

The **Stock Screening Tool** is a web-based application designed to help users filter and analyze stocks based on specific financial criteria. Inspired by Screener.in's "Create New Screen" feature, this tool allows investors, analysts, and enthusiasts to create custom screens to identify stocks that meet their investment strategies.

## Features

- **User-Friendly Query Input:**

  - Construct queries using a simple, query-like syntax.
  - Support for conditions with operators: `>`, `<`, `=`.
  - Logical AND-only filtering to ensure stocks meet all specified criteria.

- **Comprehensive Stock Data:**

  - Analyze 500 stocks with 9 key financial parameters:
    - Market Capitalization
    - P/E Ratio
    - ROE (%)
    - Debt-to-Equity Ratio
    - Dividend Yield (%)
    - Revenue Growth (%)
    - EPS Growth (%)
    - Current Ratio
    - Gross Margin (%)

- **Interactive Results Display:**

  - Tabular format showcasing all relevant parameters.
  - Sortable columns for easy data analysis.
  - Pagination with 10 stocks per page for efficient browsing.

- **Responsive Design:**

  - Optimized for both desktop and mobile devices, ensuring a seamless experience across platforms.

- **Theming:**

  - Light, dark, and system themes for personalized user experience.

## Tech Stack

- **Framework:** [Next.js 15 (App Router)](https://nextjs.org/blog/next-15)
- **Library:** [React 19](https://react.dev/blog/2024/04/25/react-19)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **UI Components:** [shadcn/ui](https://ui.shadcn.com/)
- **State Management:** React Hooks
- **Type Checking:** TypeScript
- **Deployment:** [Vercel](https://vercel.com/)

## Getting Started

### Prerequisites

- **Node.js:** Ensure you have Node.js (version 18 or later) installed. You can download it from [here](https://nodejs.org/).
- **Package Manager:** [PNPM](https://pnpm.io/) (recommended)

### Installation

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/your-username/stock-screening-tool.git
   ```

2. **Navigate to the Project Directory:**

   ```bash
   cd stock-screening-tool
   ```

3. **Install Dependencies:**

   ```bash
   pnpm install
   ```

### Running the Application

Start the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

### Building for Production

To build the application for production:

```bash
pnpm build
```

Start the production server:

Using npm:

```bash
pnpm start
```

## Usage

### Creating a New Stock Screen

1. **Navigate to the Home Page:**
   Open the application in your browser to access the main interface.

2. **Enter Your Query:**
   Use the query-like input format to define your screening criteria. Each condition should be separated by the `AND` keyword.

   **Syntax:**

   ```sql
   [Parameter] [Operator] [Value] AND
   [Parameter] [Operator] [Value] AND
   ...
   ```

   **Supported Parameters:**

   - Market Capitalization
   - P/E Ratio
   - ROE (%)
   - Debt-to-Equity Ratio
   - Dividend Yield (%)
   - Revenue Growth (%)
   - EPS Growth (%)
   - Current Ratio
   - Gross Margin (%)

   **Supported Operators:**

   - Greater than: `>`
   - Less than: `<`
   - Equal to: `=`

3. **Run the Query:**
   Click the "Run Query" button to filter stocks based on your criteria.

4. **View Results:**
   The filtered stocks will be displayed in a sortable and paginated table below the query form.

### Sample Queries

- **Large Cap Growth Stocks:**

  ```sql
  Market Capitalization > 200 AND
  ROE > 15 AND
  EPS Growth > 10
  ```

- **Dividend Value Stocks:**

  ```sql
  Dividend Yield > 2 AND
  P/E Ratio < 20 AND
  Debt-to-Equity Ratio < 1
  ```

- **High Liquidity Stocks:**

  ```sql
  Current Ratio > 2 AND
  Gross Margin > 40
  ```

## Contributing

Contributions are welcome! Please follow these steps to contribute:

1. **Fork the Repository:**
   Click the "Fork" button on the repository page.

2. **Clone Your Fork:**

   ```bash
   git clone https://github.com/your-username/stock-screening-tool.git
   ```

3. **Create a New Branch:**

   ```bash
   git checkout -b feat/YourFeatureName
   ```

4. **Make Your Changes:**
   Implement your feature or fix.

5. **Pre-Commit Checks:**
   Before committing, run these commands to ensure code quality:

   ```bash
   pnpm format   # Format code using Prettier
   pnpm lint     # Run ESLint checks
   pnpm build    # Verify build succeeds
   ```

   Fix any issues that arise from these checks.

6. **Commit Your Changes:**
   Follow the conventional commits specification for commit messages:

   ```bash
   git commit -m "<type>[optional scope]: <description>"
   ```

   Types:

   - `feat`: New feature
   - `fix`: Bug fix
   - `docs`: Documentation changes
   - `style`: Code style changes (formatting, etc.)
   - `refactor`: Code refactoring
   - `perf`: Performance improvements
   - `test`: Adding or updating tests
   - `chore`: Maintenance tasks

   Examples:

   ```bash
   git commit -m "feat(table): add sorting functionality to stock table"
   git commit -m "fix: correct stock filtering logic"
   git commit -m "docs: update installation instructions"
   git commit -m "style: improve table responsive design"
   ```

7. **Push to Your Fork:**

   ```bash
   git push origin feat/YourFeatureName
   ```

8. **Open a Pull Request:**
   Navigate to the original repository and click "New Pull Request."

## License

This project is licensed under the [MIT License](LICENSE).
