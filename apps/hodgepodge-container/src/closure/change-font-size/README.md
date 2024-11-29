# Add buttons to a page to adjust the text size

1. Specify the font-size of the body element (in pixels).
2. Then set the size of the other elements on the page (such as headers) using the relative `em` unit.
3. Now define some buttons which change the size of font size for the `body`.
   - Since we've used relative unit for `h1`, `h2`, and `p` element they can pick up the changes automatically.

> [!NOTE]
>
> Here we've:
>
> 1. Associated data (the lexical environment): 12, 14, and 16.
> 2. With a function that operates on that data: size12, size14, and size16.
>
> Similar to the object-oriented programming where we'll associate data with objects.
