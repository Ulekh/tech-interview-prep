import { useState, useDeferredValue, memo } from 'react';

// 1. Wydzielamy spowolnienie do pojedynczego komponentu
function SlowItem({ text, index }) {
  const startTime = performance.now();
  while (performance.now() - startTime < 1) {} // Blokada na 1ms

  return (
    <li>
      Wynik: {text} (element {index})
    </li>
  );
}

// 2. React będzie renderował ten komponent 500 razy
const SlowList = memo(function SlowList({ text }) {
  const items = [];
  for (let i = 0; i < 500; i++) {
    items.push(<SlowItem key={i} text={text} index={i} />);
  }
  return <ul>{items}</ul>;
});

export default function App() {
  const [text, setText] = useState('');
  const [isOptimized, setIsOptimized] = useState(true);

  // Tworzymy odroczoną wersję stanu
  const deferredText = useDeferredValue(text);

  // Zależnie od checkboxa, do ciężkiej listy przekazujemy odroczoną lub natychmiastową wartość
  const valueForList = isOptimized ? deferredText : text;

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h2>Testowanie useDeferredValue</h2>

      <label style={{ display: 'block', marginBottom: '20px', cursor: 'pointer' }}>
        <input
          type="checkbox"
          checked={isOptimized}
          onChange={(e) => setIsOptimized(e.target.checked)}
        />
        Włącz optymalizację (useDeferredValue + React.memo)
      </label>

      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Wpisuj tekst bardzo szybko..."
        style={{ padding: '10px', fontSize: '16px', width: '300px' }}
      />

      <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f0f0f0' }}>
        <p>
          Wartość w polu input (natychmiastowa): <strong>{text}</strong>
        </p>
        <p>
          Wartość renderowana na liście (odroczona): <strong>{deferredText}</strong>
        </p>
      </div>

      <hr />

      <SlowList text={valueForList} />
    </div>
  );
}
