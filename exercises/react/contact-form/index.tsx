import React, { useState } from 'react';
import './style.css';

export const ContactForm = () => {
  const [count, setCount] = useState(0);

  return (
    <div className="contact-form-container">
      <h1>ContactForm</h1>
      <p>This is your new React exercise.</p>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
      </div>
    </div>
  );
};

export default ContactForm;