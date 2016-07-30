# html-srcset-loader

Automatically add srcset to images in html

## installation

Requires [image-resize-loader](https://github.com/icewind1991/image-resize-loader) to create the resized images.

```
npm install --save-dev loader-utils jimp image-resize-loader html-srcset-loader
```

## Usage

The `html-srcset-loader` will automatically transform any image in an html document to include an `srcset` with smaller versions of the image to lower bandwith usage on lower resulution screens.


```js
loaders: [
    {
        test: /.*\.(png|jpg)(\?.+)?$/i,
        loaders: [
            'file',
            'image-resize'
        ]
    },
    {
        test: /\.html$/,
        loader: "html!html-srcset"
    },
    ...
]
```

