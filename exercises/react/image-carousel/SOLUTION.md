# Image Carousel - Solution

The solution can be broken down into two parts:

1. Rendering: Layout and positioning of buttons

2. State management: State design and state changes

## Rendering

The image carousel layout consists of 3 parts:

1. Image carousel container

The root of the image carousel will be the element responsible for the overall dimensions and containing the displayed image and button elements. Since the height is fixed, we can set `height: 400px` on the root element. However, the width is fluid and on screens smaller than 600px, it should shrink to fit within the screen. For this behavior, we can use the CSS [min](https://developer.mozilla.org/en-US/docs/Web/CSS/min) function (e.g. `min(600px, 100vw)` ).

2. Displayed image

The image can be rendered using normal `<img>` tags and `object-fit: contain` , which resizes the image to fit the available space of 600px x 400px while maintaining the intrinsic aspect ratio of the image.

3. Navigation buttons

The various buttons are positioned at fixed locations within the image carousel. This is achieved by adding `position: relative` to the root element of the image carousel and `position: absolute` to the button elements.

To vertically center the prev/next buttons, use a combination of `top: 50%; transform: translateY(-50%)` . `top: 50%` positions the element to have a vertical offset of 50% of the container element, and `translateY(-50%)` shifts the element up by half of its height. The page buttons are horizontally centered and can be done in a similar fashion.

## State

The minimal state needed for an image carousel is the current image index. Only one state value is needed.

### State changes

- Next button: Increment the currIndex by one.

- Prev button: Decrement the currIndex by one.

- Page button: Directly set the currIndex to the page number.

To enable the cycling behavior, we need to make sure that `currIndex` is always between `0` and `images.length - 1` . We can achieve this by adding `images.length` to any value and then using the modulo operator ( `%` ).

## Test cases

### 1. Functionality:

- Verify that the carousel displays the first image from the provided array upon initial load.
  Prev/next buttons
  Clicking the right button moves to the next image.
  Clicking the left button moves to the previous image.
  Page buttons
  Clicking on the page button displays the respective image.
  Cycling behavior:
  Clicking the right button on the last image should display the first image.
  Clicking the left button on the first image should display the last image.
  Ensure all images in the array are accessible through navigation.

2. Display and sizing:
   Verify the carousel is centered on the screen.
   Check that the maximum size of the carousel is 600px by 400px.
   Ensure images are fully visible within the carousel.
   Confirm that images maintain their aspect ratio when resized.
   Verify that empty parts of the carousel are filled with black.

Accessibility

- All images should have alt text that describes the image to support accessibility. It will be read out loud by screen readers and is also used by search engines.

- Add appropriate aria-labels to the buttons since the buttons do not have visible labels.

- [Not implemented]: Add a screen-reader-only element with the aria-live="polite" attribute and alt text of the new image as contents. This instructs screen readers to announce that a new image is displayed.
