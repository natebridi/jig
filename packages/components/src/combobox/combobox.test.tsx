import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Combobox } from './combobox';

const people = [
  { value: 'ada', label: 'Ada Lovelace' },
  { value: 'alan', label: 'Alan Turing' },
];

const grouped = [
  { label: 'Engineering', items: people },
  { label: 'Design', items: [{ value: 'grace', label: 'Grace Hopper' }] },
];

/**
 * What is worth asserting is the wiring the decisions turned on: that the
 * field is named, that grouping reaches the list as group structure rather
 * than as flat rows, and that filtering happens at all — 0011 D4 made that
 * Base UI's job, so this is checking the hand-off, not the algorithm.
 */
describe('Combobox', () => {
  it('takes its accessible name from the label prop', () => {
    render(<Combobox label="Assignee" items={people} />);
    expect(screen.getByRole('combobox', { name: 'Assignee' })).toBeInTheDocument();
  });

  it('filters the list as the query narrows', async () => {
    const user = userEvent.setup();
    render(<Combobox label="Assignee" items={people} />);

    await user.click(screen.getByRole('combobox'));
    expect(await screen.findByRole('option', { name: 'Ada Lovelace' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Alan Turing' })).toBeInTheDocument();

    await user.keyboard('Ada');

    expect(await screen.findByRole('option', { name: 'Ada Lovelace' })).toBeInTheDocument();
    expect(screen.queryByRole('option', { name: 'Alan Turing' })).not.toBeInTheDocument();
  });

  it('renders groups as groups, not as flattened rows', async () => {
    const user = userEvent.setup();
    render(<Combobox label="Assignee" items={grouped} />);

    await user.click(screen.getByRole('combobox'));

    // The group carries its label, which is what makes it announced as a
    // group rather than just drawn as a heading. 0011 D2.
    expect(await screen.findByRole('group', { name: 'Engineering' })).toBeInTheDocument();
    expect(screen.getByRole('group', { name: 'Design' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Grace Hopper' })).toBeInTheDocument();
  });

  it('reports the chosen value, not the item object', async () => {
    const user = userEvent.setup();
    const seen: unknown[] = [];
    render(
      <Combobox label="Assignee" items={people} onValueChange={(v) => seen.push(v)} />
    );

    await user.click(screen.getByRole('combobox'));
    await user.click(await screen.findByRole('option', { name: 'Alan Turing' }));

    expect(seen).toEqual(['alan']);
  });

  it('shows a removable chip per selection when multiple', async () => {
    render(
      <Combobox label="Reviewers" multiple items={people} value={['ada', 'alan']} />
    );

    // The chip's remove control is Base UI's button wearing Token's styles —
    // see the component comment and the doc's As built.
    expect(screen.getByRole('button', { name: 'Remove Ada Lovelace' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Remove Alan Turing' })).toBeInTheDocument();
  });

  it('shows the label in the input after selection, not the value', async () => {
    const user = userEvent.setup();
    render(<Combobox label="Assignee" items={people} />);

    await user.click(screen.getByRole('combobox'));
    await user.click(await screen.findByRole('option', { name: 'Alan Turing' }));

    // The input's text is derived from the selected value, which is a
    // primitive — so without an explicit label resolver it serialises to
    // `alan`. See the itemToStringLabel comment in combobox.tsx.
    expect(screen.getByRole('combobox')).toHaveValue('Alan Turing');
  });

  it('shows the label for a controlled value it was given', () => {
    render(<Combobox label="Assignee" items={people} value="alan" />);
    expect(screen.getByRole('combobox')).toHaveValue('Alan Turing');
  });

  it('resolves a label from inside a group', async () => {
    const user = userEvent.setup();
    render(<Combobox label="Assignee" items={grouped} />);

    await user.click(screen.getByRole('combobox'));
    await user.click(await screen.findByRole('option', { name: 'Grace Hopper' }));

    expect(screen.getByRole('combobox')).toHaveValue('Grace Hopper');
  });

  it('marks the field invalid and shows an error from outside', () => {
    render(<Combobox label="Assignee" items={people} error="Pick someone" />);

    expect(screen.getByRole('combobox')).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByText('Pick someone')).toBeInTheDocument();
  });

  it('forwards a ref to the input', () => {
    const ref = createRef<HTMLInputElement>();
    render(<Combobox label="Assignee" items={people} ref={ref} />);

    expect(ref.current?.tagName).toBe('INPUT');
  });
});
