'use client';

import { RotateCcw, Shuffle } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

interface ConnectionGroup {
  name: string;
  description: string;
  color: string;
  words: string[];
}

interface SolvedGroup extends ConnectionGroup {
  id: string;
}

const groups: ConnectionGroup[] = [
  {
    name: 'IPL Teams',
    description: 'Franchise names from Indian Premier League cricket.',
    color: 'bg-amber-500 text-black',
    words: ['MI', 'CSK', 'RCB', 'KKR'],
  },
  {
    name: 'Street Food',
    description: 'Popular bites you will find across Indian streets.',
    color: 'bg-sky-500 text-white',
    words: ['VADA PAV', 'POHA', 'CHAAT', 'IDLI'],
  },
  {
    name: 'UPI Apps',
    description: 'Common payment apps used in India.',
    color: 'bg-emerald-500 text-black',
    words: ['GPAY', 'PHONEPE', 'PAYTM', 'BHIM'],
  },
  {
    name: 'Hill Stations',
    description: 'Classic Indian mountain getaways.',
    color: 'bg-fuchsia-500 text-white',
    words: ['SHIMLA', 'OOTY', 'MANALI', 'MUNNAR'],
  },
];

const allWords = groups.flatMap((group) => group.words);

function stableShuffle(words: string[]) {
  return [...words].sort((a, b) => {
    const left = a.charCodeAt(0) + a.length;
    const right = b.charCodeAt(0) + b.length;
    return left - right;
  });
}

function randomShuffle(words: string[]) {
  return [...words].sort(() => Math.random() - 0.5);
}

function findSolvedGroup(selectedWords: string[]) {
  const selected = [...selectedWords].sort().join('|');

  return groups.find((group) => [...group.words].sort().join('|') === selected);
}

export function ConnectionsIndiaGame() {
  const initialWords = useMemo(() => stableShuffle(allWords), []);
  const [availableWords, setAvailableWords] = useState(initialWords);
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [solvedGroups, setSolvedGroups] = useState<SolvedGroup[]>([]);
  const [mistakes, setMistakes] = useState(0);
  const [message, setMessage] = useState(
    'Pick four tiles that share a hidden connection.',
  );

  const isComplete = solvedGroups.length === groups.length;
  const remainingMistakes = Math.max(0, 4 - mistakes);

  function toggleWord(word: string) {
    if (selectedWords.includes(word)) {
      setSelectedWords((current) => current.filter((item) => item !== word));
      return;
    }

    if (selectedWords.length === 4) {
      setMessage('You already selected four. Submit or deselect one tile.');
      return;
    }

    setSelectedWords((current) => [...current, word]);
  }

  function submitSelection() {
    if (selectedWords.length !== 4) {
      setMessage('Select exactly four tiles before submitting.');
      return;
    }

    const solvedGroup = findSolvedGroup(selectedWords);

    if (!solvedGroup) {
      setMistakes((current) => current + 1);
      setSelectedWords([]);
      setMessage('Not quite. Try another combination.');
      return;
    }

    setSolvedGroups((current) => [
      ...current,
      {
        ...solvedGroup,
        id: solvedGroup.name,
      },
    ]);
    setAvailableWords((current) =>
      current.filter((word) => !solvedGroup.words.includes(word)),
    );
    setSelectedWords([]);
    setMessage(`Nice. You found ${solvedGroup.name}.`);
  }

  function shuffleRemaining() {
    setAvailableWords((current) => randomShuffle(current));
  }

  function resetGame() {
    setAvailableWords(randomShuffle(allWords));
    setSelectedWords([]);
    setSolvedGroups([]);
    setMistakes(0);
    setMessage('Pick four tiles that share a hidden connection.');
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="rounded-xl border border-border bg-card p-4 shadow-sm sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="font-mono text-sm text-primary">Sample puzzle</p>
            <h2 className="mt-2 font-heading text-3xl font-bold tracking-tight">
              Connections India
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
              Group the 16 tiles into four sets of four. This version runs fully
              in the browser with static data, so it costs nothing to host.
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              aria-label="Shuffle remaining tiles"
              className="h-10 w-10 px-0"
              onClick={shuffleRemaining}
              type="button"
              variant="outline"
            >
              <Shuffle className="h-4 w-4" aria-hidden="true" />
            </Button>
            <Button
              aria-label="Reset puzzle"
              className="h-10 w-10 px-0"
              onClick={resetGame}
              type="button"
              variant="outline"
            >
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
            </Button>
          </div>
        </div>

        <div className="mt-6 space-y-3" aria-live="polite">
          {solvedGroups.map((group) => (
            <div
              className={cn('rounded-lg p-4 text-center', group.color)}
              key={group.id}
            >
              <h3 className="font-heading text-lg font-bold">{group.name}</h3>
              <p className="mt-1 text-sm opacity-90">
                {group.words.join(', ')}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {availableWords.map((word) => {
            const isSelected = selectedWords.includes(word);

            return (
              <button
                className={cn(
                  'flex aspect-[2.4/1] min-h-16 items-center justify-center rounded-lg border border-border bg-muted px-2 text-center text-sm font-bold uppercase tracking-wide transition-all hover:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:text-base',
                  isSelected &&
                    'border-primary bg-primary text-primary-foreground shadow-sm',
                )}
                key={word}
                onClick={() => toggleWord(word)}
                type="button"
              >
                {word}
              </button>
            );
          })}
        </div>

        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium">
              {isComplete ? 'Puzzle complete.' : message}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Mistakes remaining: {remainingMistakes}
            </p>
          </div>
          <Button disabled={isComplete} onClick={submitSelection} type="button">
            Submit
          </Button>
        </div>
      </div>
    </div>
  );
}
