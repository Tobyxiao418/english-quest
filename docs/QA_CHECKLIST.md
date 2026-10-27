# V1 release verification

Release runtime commit: c8f09ecc07bd78399d3fe9678c7ad609c8e49dce
Live URL: https://tobyxiao418.github.io/english-quest/
Repository: https://github.com/Tobyxiao418/english-quest

## Passed
- 66 Node course/core tests; syntax check.
- Three courses, 54 tasks including 30 speaking/open-response activities.
- Desktop Chrome automation completed all 54 live steps using visible controls; no uncaught page errors.
- Wrong answer rejection, shuffled word composition, typing, self-practice confirmation.
- Reload/resume, export with no recording data, cancelling reset.
- Actual MediaRecorder record/replay tested using a synthetic WebAudio stream (not a real microphone).
- Denied microphone path preserves explicit self-practice option.
- Browser speech: natural local Daniel en-GB selected; actual start and end events observed on local app.
- LocalStorage unavailable: app remains usable with explicit persistence warning.
- No desktop or 390px viewport horizontal overflow.
- All six live runtime resources HTTP 200; Pages deployment succeeded.
- No app cross-origin data requests observed in full task test. Browser/OS speech internals and hosting logs are outside this assertion.

## Reviews
- Independent teaching-content and specification review PASS.
- Independent code-quality reviewer hit usage limit before final verdict; changes were read and final checks rerun by parent, not falsely called independently approved.
- Parent reviewed voice initialization, microphone pending requests, late stream shutdown, DOM text handling and local-data boundaries.

## Family acceptance still needed
- Home computer/network accessibility and actual microphone/audio playback quality.
- Learning enjoyment, difficulty and real duration. 30–45 minutes is a practice-route estimate including repetition and role swaps, not measured child study time.
- No automated speech recognition, pronunciation scoring or AI dialogue in V1.
- Public tool; progress local; temporary recordings discarded on navigation, never uploaded by app.

Rerun: npm test; npm run check. Browser QA requires Playwright and Chrome, with PLAYWRIGHT_PATH pointing to the installed package when not locally installed. SITE_URL selects local/live target. Never use child data for automated tests.
