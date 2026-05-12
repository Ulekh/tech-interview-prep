import React, { useState } from 'react';
import './style.css';
import Tabs from './tabs';

const tabs = [
  {
    value: 'html',
    label: 'HTML',
    panel:
      'The HyperText Markup Language or HTML is the standard markup language for documents designed to be displayed in a web browser.',
  },
  {
    value: 'css',
    label: 'CSS',
    panel:
      'Cascading Style Sheets is a style sheet language used for describing the presentation of a document written in a markup language such as HTML or XML.',
  },
  {
    value: 'javascript',
    label: 'JavaScript',
    panel:
      'JavaScript, often abbreviated as JS, is a programming language that is one of the core technologies of the World Wide Web, alongside HTML and CSS.',
  },
];

export const Tabs_1 = () => {
  return (
    <div className="tabs_1-container">
      <Tabs items={tabs} />
    </div>
  );
};

export default Tabs_1;
