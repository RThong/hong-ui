/**
 * title: 基本用法
 * desc: 最基本的用法。
 */
import React, { useState } from 'react';
import { Button, Transition } from 'hong-react-ui';
import 'hong-react-ui/dist/index.css';

import './index.less';

const Demo = () => {
  const [visible, setVisible] = useState(false);
  return (
    <div style={{ display: 'flex' }}>
      <Button
        type="primary"
        onClick={() => setVisible((v) => !v)}
        style={{ marginRight: 20 }}
      >
        执行动画
      </Button>

      <Transition
        visible={visible}
        afterEnter={{ transform: `translateX(300%)` }}
      >
        {({ style: motionStyle }, motionRef) => (
          <div className="transition-box" style={motionStyle} ref={motionRef} />
        )}
      </Transition>
    </div>
  );
};

export default Demo;
