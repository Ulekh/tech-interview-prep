import React, { useState } from 'react';
import './style.css';
import submitForm from './submit-form';

export const ContactForm = () => {
  const [count, setCount] = useState(0);

  return (
    <div className="contact-form-container">
      <h1>Contact Form</h1>
      <form
        // Ignore the onSubmit prop, it's used by GFE to
        // intercept the form submit event to check your solution.
        onSubmit={submitForm}
      >
        <p>
          <label htmlFor="name">Name</label>
          <input type="text" name="name" id="name" />
        </p>

        <p>
          <label htmlFor="email">E-mail</label>
          <input type="email" name="email" />
        </p>

        <p>
          <label htmlFor="message">Message</label>
          <textarea name="message" id="message" />
        </p>

        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default ContactForm;
