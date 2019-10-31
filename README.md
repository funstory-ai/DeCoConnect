# Janus

Find and mark translation errors, Chrome Extension , TypeScript

## Setup

```cmd
npm install
```

Copy `config.sample.json` and rename it to `config.json`.

Fill in the correct information.

## Develop

```cmd
npm run dev
```

## Build

```cmd
npm run build
```

## Load extension to chrome

Load `dist` directory

## 注意事项

以下替换已经通过`./fixVendorJs.ts`来实现，正常`build`就行

`build`之后的包无法导入Chrome的解决方案：
打开`js/vendor.js`文件, 全文搜索替换`￿`为`\uffff`

资料来自`firebase`这个没cloes掉的[issue](https://github.com/firebase/firebase-js-sdk/issues/414#issuecomment-425971641)(18年1月开的)。

由于`firebase`引用一个库, 这个库的[这行代码](https://github.com/google/closure-library/blob/db35cf1524b36a50d021fb6cf47271687cc2ea33/closure/goog/json/json.js#L305)里的`.test('\uffff')`经过`webpack`压缩后会变成`.test("￿")`，导致build后的插件导入Chrome会报错:`Could not load file 'js/vendor.js' for content script. It isn't UTF-8 encoded.`
