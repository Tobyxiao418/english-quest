# Release QA checklist

- [x] `npm test`: 66 tests passed in initial implementation (rerun after final changes).
- [x] All three course cards load in desktop Chrome.
- [x] All 54 steps completed through visible controls, not direct progress injection.
- [x] Wrong choice/typed answer does not silently award completion.
- [ ] Listen mode does not reveal its transcript until requested or checked.
- [ ] Speaking and open responses distinguish recording from self-practice; no fake score.
- [ ] Browser microphone denial shows a useful recovery path.
- [ ] Real MediaRecorder pipeline records/replays a synthetic fixture and stops tracks on navigation (not proof of child's real microphone quality).
- [ ] Browser audio-synthesis start/end callbacks verified (not human acoustic listening review).
- [ ] Reload restores progress; report contains no audio or personal identity.
- [ ] Existing progress reset requires confirmation.
- [ ] Public URL and all runtime assets return successful responses.
- [ ] Live-page smoke test on GitHub subpath.
- [ ] User-facing limitations: no V1 automatic speech feedback; voice depends on browser; home-network/child-experience acceptance still required.

Browser tests and downloaded reports must not include child data. Test only synthetic, anonymous content. Keep test evidence local unless sanitized.
