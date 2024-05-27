<h1>React Image Magnifier Waft</h1>

<p> <code>React Image Magnifier Waft</code> is an <strong> open-source image-zooming npm package </strong>. You may have seen really nice image zooming on ecommerce sites like amazon , flipkart and more. If you want same functionality on your site then you can use this </p>
<p>This package is forked from <a href='https://www.npmjs.com/package/react-image-magnify'>react-image-magnify</a> and maintained. The code has been changed from class-based components to functional-based components compatible with React v18 with removal of defaultProps which has been depreceated.</p>

A responsive React image zoom component for touch and mouse.

Designed for shopping site product detail.

Features Include:

- In-place and side-by-side image enlargement
- Positive or negative space guide lens options
- Interaction hint
- Configurable enlarged image dimensions
- Optional enlarged image external render
- Hover intent
- Long-press gesture
- Fade transitions
- Basic react-slick carousel support

## Status

[![npm](https://img.shields.io/npm/v/easy-magnify.svg)](https://www.npmjs.com/package/easy-magnify)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](https://opensource.org/licenses/MIT)

Author: <a href='https://www.wafttech.com/'>Waft Technology</a> <br>

## Demo

Coming soon\* but works same like react-image-magnify package

## Installation

```sh
npm install easy-magnify-waft
```

## Usage

Usage is pretty simple. Remember: using latest version of this package is always recommended

```JavaScript
import ReactImageMagnify from 'easy-magnify-waft';
...
<ReactImageMagnify {...{
    smallImage: {
        alt: 'redmi-phone',
        isFluidWidth: true,
        src: "assets/images/redmi-300.png"
    },
    largeImage: {
        src: "assets/images/redmi-1200.png",
        width: 1200,
        height: 1800
    }
    enlargedImageStyle: {
        objectFit: "contain",
    },
    enlargedImagePortalId: "ProductMagnify or preferred portal id",
    enlargedImageContainerClassName: "enlargeImage or preferred portal class",
    className: "magnifyimg or preferred portal class",
}} />
...
```

```JavaScript
    ./styles.css;

    .enlargeImage img {
        max-width: none;
    }

    .enlargeImage {
        background-color: #ffffff;
        border: none !important;
        box-shadow: rgba(0, 0, 0, 0.25) 0px 0.0625em 0.0625em,
            rgba(0, 0, 0, 0.25) 0px 0.125em 0.5em,
            rgba(255, 255, 255, 0.1) 0px 0px 0px 1px inset;
    }

    // This is the portal div with portal id
    #ProductMagnify {
        position: absolute;
        left: 1%;
        top: 0;
        z-index: 9;
        transform: scale(0);
        opacity: 0;
        transition: all 0.2s ease-in-out;
    }

    // This div is added above the ReactImageMagnify component and is used to show the magnified image when hovered
    .ProExternaldiv:hover #ProductMagnify {
        left: 50%; /** Adjust left from your main div accordingly **/
        transform: scale(1.25); /** Scale magnified image accordingly **/
        opacity: 1;
    }

    .magnifyimg > img {
        /** Magnified Image Classs **/
    }


```

Usage with external carousel library such as <a href='https://www.npmjs.com/package/react-responsive-carousel'>react-responsive-carousel</a> is very simple. In this case if you want your portal element outside of the your react magnify component scope you can target and change the style of the portal element using plain JS just targetting the element and changing it's opacity and scale value.

```JavaScript
import ReactImageMagnify from 'easy-magnify-waft';
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

  const handleMouseEnter = () => {
    const elem = document.getElementById("ProductMagnify"); // Your preferred portal id
    if (elem) {
      elem.style.opacity = 1;
      elem.style.transform = `scale(1.25)`;
      elem.style.left = "50%";
    }
  };

  const handleMouseLeave = () => {
    const elem = document.getElementById("ProductMagnify"); // Your preferred portal id
    if (elem) {
      elem.style.opacity = 0;
      elem.style.transform = `scale(0)`;
    }
  };

    // ** Note you can achieve this using css also. But in this approach my portal div is outside of the magnify scope, I am using js to target the elem and change it's style.
...
    <div
        className="w-1/3"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <Carousel
          showIndicators={false}
          renderThumbs={() =>
            images.map((each) => (
              <Fragment key={each.thumbnail}>
                <img
                  src={each.thumbnail}
                  alt={each.thumbnail}
                  className="w-[80px] h-[78px] object-contain"
                />
              </Fragment>
            ))
          }
        >
          {images.map((each) => (
            <Fragment key={each.original}>
              <ReactImageMagnify
                className="magnifyimg"
                {...{
                  smallImage: {
                    alt: "Testing",
                    imageClassName: "magnifyimgA w-full h-full object-contain",
                    src: each.original,
                    isFluidWidth: true,
                  },
                  largeImage: {
                    alt: "Testing",
                    src: each.original,
                    width: 1024,
                    height: 1024,
                  },
                  enlargedImageStyle: {
                    objectFit: "contain",
                  },
                  enlargedImagePortalId: "ProductMagnify",
                  enlargedImageContainerClassName: "enlargeImage",
                  shouldUsePositiveSpaceLens: false,
                }}
              />
            </Fragment>
          ))}
        </Carousel>
      </div>
      <div className="w-2/3 relative">
        <div id="ProductMagnify" />
        <div className="text-2xl font-bold">Another Div (outside of component scope)</div>
    </div>
...
```

## Required Props

| Prop       | Type   | Default | Description                                                     |
| ---------- | ------ | ------- | --------------------------------------------------------------- |
| smallImage | Object | N/A     | Small image information. See [Small Image](#small-image) below. |
| largeImage | Object | N/A     | Large image information. See [Large Image](#large-image) below. |

## Optional Styling Props

| Prop                            | Type   | Default | Description                                            |
| ------------------------------- | ------ | ------- | ------------------------------------------------------ |
| className                       | String | N/A     | CSS class applied to root container element.           |
| style                           | Object | N/A     | Style applied to root container element.               |
| imageClassName                  | String | N/A     | CSS class applied to small image element.              |
| imageStyle                      | Object | N/A     | Style applied to small image element.                  |
| lensStyle                       | Object | N/A     | Style applied to tinted lens.                          |
| enlargedImageContainerClassName | String | N/A     | CSS class applied to enlarged image container element. |
| enlargedImageContainerStyle     | Object | N/A     | Style applied to enlarged image container element.     |
| enlargedImageClassName          | String | N/A     | CSS class applied to enlarged image element.           |
| enlargedImageStyle              | Object | N/A     | Style applied to enlarged image element.               |

## Optional Interaction Props

| Prop               | Type    | Default | Description                                                        |
| ------------------ | ------- | ------- | ------------------------------------------------------------------ |
| fadeDurationInMs   | Number  | 300     | Milliseconds duration of magnified image fade in/fade out.         |
| hoverDelayInMs     | Number  | 250     | Milliseconds to delay hover trigger.                               |
| hoverOffDelayInMs  | Number  | 150     | Milliseconds to delay hover-off trigger.                           |
| isActivatedOnTouch | Boolean | false   | Activate magnification immediately on touch. May impact scrolling. |
| pressDuration      | Number  | 500     | Milliseconds to delay long-press activation (long touch).          |
| pressMoveThreshold | Number  | 5       | Pixels of movement allowed during long-press activation.           |

## Optional Behavioral Props

| Prop                                 | Type     | Default                         | Description                                                                                                                                                                                                                                                                                                                    |
| ------------------------------------ | -------- | ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| enlargedImagePosition                | String   | beside (over for touch)         | Enlarged image placement. Can be 'beside' or 'over'.                                                                                                                                                                                                                                                                           |
| enlargedImageContainerDimensions     | Object   | {width: '100%', height: '100%'} | Specify enlarged image container dimensions as an object with width and height properties. Values may be expressed as a percentage (e.g. '150%') or a number (e.g. 200). Percentage is based on small image dimension. Number is pixels. Not applied when enlargedImagePosition is set to 'over', the default for touch input. |
| enlargedImagePortalId                | String   | N/A                             | Render enlarged image into an HTML element of your choosing by specifying the target element id. Requires React v16. Ignored for touch input by default - see isEnlargedImagePortalEnabledForTouch.                                                                                                                            |
| isEnlargedImagePortalEnabledForTouch | Boolean  | false                           | Specify portal rendering should be honored for touch input.                                                                                                                                                                                                                                                                    |
| hintComponent                        | Function | (Provided)                      | Reference to a component class or functional component. A Default is provided.                                                                                                                                                                                                                                                 |
| shouldHideHintAfterFirstActivation   | Boolean  | true                            | Only show hint until the first interaction begins.                                                                                                                                                                                                                                                                             |
| isHintEnabled                        | Boolean  | false                           | Enable hint feature.                                                                                                                                                                                                                                                                                                           |
| hintTextMouse                        | String   | Hover to Zoom                   | Hint text for mouse.                                                                                                                                                                                                                                                                                                           |
| hintTextTouch                        | String   | Long-Touch to Zoom              | Hint text for touch.                                                                                                                                                                                                                                                                                                           |
| shouldUsePositiveSpaceLens           | Boolean  | false                           | Specify a positive space lens in place of the default negative space lens.                                                                                                                                                                                                                                                     |
| lensComponent                        | Function | (Provided)                      | Specify a custom lens component.                                                                                                                                                                                                                                                                                               |

### Small Image

```
{
    src: String, (required)
    srcSet: String,
    sizes: String,
    width: Number, (required if isFluidWidth is not set)
    height: Number, (required if isFluidWidth is not set)
    isFluidWidth: Boolean, (default false)
    alt: String,
    onLoad: Function,
    onError: Function
}
```

For more information on responsive images, please try these resources:  
[Responsive Images 101](https://cloudfour.com/thinks/responsive-images-101-definitions/)  
[Responsive Images - The srcset and sizes Attributes](https://bitsofco.de/the-srcset-and-sizes-attributes/)

### Large Image

```
{
    src: String, (required)
    srcSet: String,
    sizes: String,
    width: Number, (required)
    height: Number, (required)
    alt: String, (defaults to empty string)
    onLoad: Function,
    onError: Function
}
```

## Support

Please [open an issue](https://github.com/john-subba/react-image-magnifier/issues).

<p>The inspiration is taken from other package that has not been updated since last 3-4 years and many people seem to use it till now even after it conflicts with React 17 & 18.
If you like this package then make sure to give it some stars.</p>

## Contributing

Please contribute using [Github Flow](https://guides.github.com/introduction/flow/). Create a branch,
add commits, and [open a pull request](https://github.com/john-subba/react-image-magnifier/compare/).
