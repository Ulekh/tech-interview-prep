import html from './index.html?raw';
import { init } from './index';

describe('signup-form', () => {
  beforeEach(() => {
    document.body.innerHTML = html;
    init();
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('should render the signup form and username input', () => {
    expect(document.querySelector('#signup-form')).toBeInTheDocument();
    expect(document.querySelector('#username')).toBeInTheDocument();
    expect(document.querySelector('.submit-btn')).toBeInTheDocument();
  });
});
