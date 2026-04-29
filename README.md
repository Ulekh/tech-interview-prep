# Technical Interview Prep - Practice Environment

Ten projekt został stworzony, aby pomóc Ci przygotować się do technicznych rozmów rekrutacyjnych w stylu "kata-machine".

## Struktura projektów
Każde zadanie znajduje się w folderze `exercises/` i ma następującą strukturę:
- `README.md`: Opis zadania i wymagania.
- `SOLUTION.md`: Przykładowe rozwiązanie z omówieniem.
- `index.ts` lub `Exercise.tsx`: Plik, w którym piszesz swój kod.
- `index.test.ts` lub `Exercise.test.tsx`: Testy jednostkowe sprawdzające poprawność rozwiązania.

## Jak ćwiczyć?
1. Wybierz zadanie z folderu `exercises/`.
2. Przeczytaj treść w `README.md`.
3. Zaimplementuj rozwiązanie w pliku z kodem.
4. Uruchom testy, aby sprawdzić poprawność:
   ```bash
   npm test
   ```
   Możesz też uruchomić testy dla konkretnego zadania:
   ```bash
   npx vitest exercises/typescript/easy/two-sum/
   ```
5. Po ukończeniu (lub jeśli utkniesz), zajrzyj do `SOLUTION.md`.

## Dodawanie nowych zadań
Po prostu stwórz nowy folder w `exercises/` zgodnie z kategorią (np. `exercises/typescript/medium/some-task/`) i skopiuj strukturę plików z istniejących przykładów.

## Inne języki programowania
Projekt jest przygotowany głównie pod TS/React (Vitest), ale możesz łatwo dodać inne języki:
1. Stwórz folder dla języka, np. `exercises/python/`.
2. Dodaj zadanie z plikiem `.py` i testami (np. `pytest`).
3. Uruchamiaj testy dedykowanym runnerem dla danego języka.

W przyszłości planujemy dodać wsparcie dla Svelte oraz innych popularnych technologii.
