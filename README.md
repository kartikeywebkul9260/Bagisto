# Bagisto
for test test-cases

# Laravel Bagisto Playwright Test Cases For Bagisto v2.2.2

## Introduction
Playwright Test is designed for end-to-end testing, providing support for all modern rendering engines, including Chromium, WebKit, and Firefox. It allows you to test applications on Windows, Linux, and macOS, whether locally or in CI environments. You can run tests in both headless and headed modes, with native mobile emulation for Google Chrome on Android and Mobile Safari.

## Installing Playwright

Step 1: Create a Folder
> Create a new folder for your test project.

Step 2: Open the Folder in Terminal
> Navigate to the folder path using your terminal.

Step 3: Initialize Playwright
> Run the following command to set up Playwright:

---
    npm init playwright@latest
---

>Install readline-sync
---
    npm install readline-sync
---

> Choose TypeScript when prompted.
> Name your tests folder (tests).

Step 5: Update Files and Directories
> After initialization, you will find files and directories:
> Replace all files with extracted file
> Open Config/Config.ts and replace the example baseUrl with your server URL.
> Open Config/Config.ts and replace the default customer and admin credentials for login also set filePath to a folder where you have multiple images.

## Running Your Tests

Open Playwright Test UI
~~~
    npx playwright test --ui
~~~

## Generating HTML Reports
~~~
    npx playwright show-report
~~~

Note - Use the demo project and test one by one for optimal performance. Analyze the results by reviewing the test videos generated in the 'videos' folder after each test.
