# hong-react-ui

### 一套基于 `React Hook` 和 `Typescript` 编写的 PC 端组件库

![](https://img.shields.io/badge/license-MIT-000000.svg)

> 本组件库仅供学习交流，请勿在生产环境中使用

[预览地址](https://rthong.github.io/hong-react-ui/)

## 安装

```
$ npm install hong-react-ui
$ yarn add hong-react-ui
```

## 使用

```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import { Button } from 'hong-react-ui';
import 'hong-react-ui/dist/index.css';

ReactDOM.render(
  <div>
    <Button type="primary">Primary</Button>
  </div>,
  mountNode,
);
```

需要注意的是，样式文件需要单独引入。

## 特别提醒

使用 `hong-react-ui` 时，需要使用 border-box 盒模型，否则会影响样式。代码示例：

```css
*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
```

如果您觉得还不错，请 star
