# English Quest Implementation Plan

> For Hermes: execute with subagent-driven-development and separate specification and code-quality review.

Goal: zero-additional-cost desktop browser English practice for a grade-six learner who reads simple sentences but lacks speaking confidence.

Architecture: static ES modules deployed on GitHub Pages; localStorage progress; short-lived MediaRecorder blobs; no paid API, no server, no child data upload. Public tool page explicitly approved by parent; not a private authenticated service. First release is guided oral practice, not AI speech assessment.

Tech stack: HTML/CSS/JavaScript, Web Speech synthesis, MediaRecorder, Node built-in test runner, Playwright browser testing, GitHub Pages branch deployment.

## Tasks and acceptance
1. Research: inspect actual GitHub repositories, licenses and requirements; avoid wholesale backend adoption.
2. Courses: courses.js, three topics, 18 tasks each; all five practice types and at least seven oral tasks per topic. Test content consistency with tests/content.test.js.
3. App: index.html/style.css/app.js/core.js. Listen, arrange words, type, speak/replay and open response; accessible controls; positive completion feedback distinct from mastery.
4. Persistence: reload resumes, safe storage failure, local export, confirmation before reset; never persist audio.
5. Audio: browser synthesis baseline; local audio-map optional if legitimately generated available. No external speech-recognition service enabled by default. Microphone permission requested only on explicit click.
6. Tests: node --test, browser completion of every practice type, reload, wrong answers, microphone refusal, mock-media lifecycle; distinguish simulated tests from real human speaking QA.
7. Publishing: dedicated new repository, no edits to existing SoulStone repos. Deploy static runtime assets only through Pages. Verify remote repository, Pages state, HTTPS URL, required asset requests and a live browser exercise.

## Boundaries
No new payments, subscriptions or keys. No Hermes/Gateway/proxy changes. No child identity. Source material is original daily-life content, not a claim of exact Hunan textbook alignment. Estimated 30+ minute route must be validated by child use; no artificial waiting to force time.

## Release gate
Actual accessible URL and verified core flow; report that V1 has recording/replay and self-review rather than automated pronunciation assessment or natural AI dialogue. Home-network usability requires family device check; do not pretend this machine proves every network.
