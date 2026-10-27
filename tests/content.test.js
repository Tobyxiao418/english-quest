import test from 'node:test';
import assert from 'node:assert/strict';
import { courses } from '../courses.js';

const kinds = ['listen', 'build', 'type', 'speak', 'respond'];
const nonempty = (value, label) => {
  assert.equal(typeof value, 'string', `${label} must be a string`);
  assert.ok(value.trim().length > 0, `${label} must not be blank`);
  assert.equal(value, value.trim(), `${label} has outer whitespace`);
};

test('exactly three original courses with 54 globally unique steps', () => {
  assert.equal(courses.length, 3);
  assert.equal(new Set(courses.map(course => course.id)).size, 3);
  const steps = courses.flatMap(course => course.steps);
  assert.equal(steps.length, 54);
  assert.equal(new Set(steps.map(step => step.id)).size, 54);
});

for (const course of courses) {
  test(`${course.id}: complete metadata, 18 steps, all five kinds and oral emphasis`, () => {
    for (const key of ['id', 'title', 'emoji', 'goal', 'scene']) {
      nonempty(course[key], `${course.id}.${key}`);
    }
    assert.equal(course.steps.length, 18);
    assert.deepEqual([...new Set(course.steps.map(step => step.type))].sort(), [...kinds].sort());
    const oral = course.steps.filter(step => ['speak', 'respond'].includes(step.type));
    assert.ok(oral.length >= 7, 'at least seven oral steps per course');
    assert.equal(course.steps.at(-1).type, 'respond', 'finish with personal expression');
    for (let i = 1; i < course.steps.length; i++) {
      assert.ok(!(course.steps[i].type === 'type' && course.steps[i - 1].type === 'type'), 'avoid consecutive typing tasks');
    }
  });

  for (const step of course.steps) {
    test(`${step.id}: valid playable content and type-specific contract`, () => {
      for (const key of ['id', 'type', 'prompt', 'en', 'zh']) {
        nonempty(step[key], `${step.id}.${key}`);
      }
      assert.ok(kinds.includes(step.type));
      assert.match(step.en, /[A-Za-z]/, 'English model must contain English');
      assert.doesNotMatch(step.en, /[\u3400-\u9fff]/, 'playable English must not contain Chinese');
      assert.match(step.prompt, /[\u3400-\u9fff]/, 'instructions must support Chinese readers');
      assert.match(step.zh, /[\u3400-\u9fff]/, 'model must have a Chinese meaning');
      const sentences = step.en.split(/[.!?]+/).filter(part => part.trim());
      assert.ok(sentences.length >= 1 && sentences.length <= 2, 'one or two model sentences/phrases');
      if (step.hint !== undefined) nonempty(step.hint, `${step.id}.hint`);
      if (step.keywords !== undefined) {
        assert.ok(Array.isArray(step.keywords));
        assert.ok(step.keywords.length > 0);
        for (const word of step.keywords) nonempty(word, `${step.id}.keyword`);
        assert.equal(new Set(step.keywords).size, step.keywords.length);
      }
      if (step.type === 'listen') {
        assert.ok(Array.isArray(step.options));
        assert.equal(step.options.length, 3);
        for (const option of step.options) nonempty(option, `${step.id}.option`);
        assert.equal(new Set(step.options).size, 3, 'choices must be distinct');
        assert.ok(step.options.includes(step.answer), 'answer must exactly match an option');
      } else {
        assert.equal(step.options, undefined, 'only listening uses answer options');
        assert.equal(step.answer, undefined, 'models and personal responses are not answer keys');
      }
      if (step.type === 'build') {
        const tokens = step.en.split(/\s+/);
        assert.ok(tokens.length >= 3 && tokens.length <= 12, 'manageable build length');
        assert.equal(tokens.join(' '), step.en, 'whitespace tokens must reconstruct the target exactly');
      }
      if (step.type === 'type') {
        assert.ok(step.en.split(/\s+/).length <= 6, 'typing must remain short');
        assert.ok(step.en.length <= 40, 'avoid typing overwhelm');
      }
      if (step.type === 'respond') {
        assert.match(step.prompt, /[A-Za-z].*\?/, 'response prompt includes an English question');
        assert.equal(step.answer, undefined, 'personal responses must not be auto-scored');
      }
    });
  }
}
