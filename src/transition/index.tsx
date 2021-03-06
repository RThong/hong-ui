import React, { useEffect, useRef, useState } from 'react';

import './index.less';

export interface TransitionProps {
  beforeEnter?: React.CSSProperties;
  afterEnter: React.CSSProperties;
  beforeLeave?: React.CSSProperties;
  afterLeave?: React.CSSProperties;
  visible: boolean;
  transitionActive?: React.CSSProperties;
  removeOnLeave?: boolean;
  children?: (
    props: {
      visible?: boolean;
      className?: string;
      style?: React.CSSProperties;
      [key: string]: any;
    },
    ref: any,
  ) => React.ReactElement;
  afterClose?: () => void;

  onBeforeEnter?: () => void;
}

enum Status {
  beforeEnter = 'beforeEnter',
  activeEnter = 'activeEnter',
  afterEnter = 'afterEnter',
  beforeLeave = 'beforeLeave',
  activeLeave = 'activeLeave',
  afterLeave = 'afterLeave',
}

const Transition = (props: TransitionProps) => {
  const {
    children,
    beforeEnter,
    afterEnter,
    beforeLeave,
    afterLeave,
    transitionActive,
    visible,
    removeOnLeave = true,
    afterClose,
    onBeforeEnter,
  } = props;

  // 控制动画结束后元素的隐藏
  const [animationVisible, setAnimationVisible] = useState(false);

  // 具体动画进行通过设置元素style
  const [contentStyle, setContentStyle] = useState<React.CSSProperties>({});

  // 根据不同阶段的状态  去驱动动画的进行
  const [status, setStatus] = useState<Status>();

  // 大概率是HTMLElement
  const ref = useRef<any>(null);

  const afterCloseRef = useRef<(() => void) | undefined>(afterClose);

  useEffect(() => {
    afterClose && (afterCloseRef.current = afterClose);
  }, [afterClose]);

  // 外部各时刻样式都为数组，避免直接依赖
  const transitionStyleRef = useRef(transitionActive);

  const beforeEnterRef = useRef(beforeEnter);
  const afterEnterRef = useRef(afterEnter);
  const beforeLeaveRef = useRef(beforeLeave);
  const afterLeaveRef = useRef(afterLeave);

  const onBeforeEnterRef = useRef(onBeforeEnter);

  useEffect(() => {
    onBeforeEnter && (onBeforeEnterRef.current = onBeforeEnter);
  }, [onBeforeEnter]);

  useEffect(() => {
    if (visible) {
      setContentStyle({
        transition: '',
        ...(beforeEnterRef.current || {}),
      });
      setAnimationVisible((v) => (!v ? true : false));
      setStatus(Status.beforeEnter);
    }
  }, [visible]);

  useEffect(() => {
    let timer: number;
    if (status === Status.beforeEnter && visible) {
      // 在元素创建后调用
      onBeforeEnterRef.current?.();

      timer = window.setTimeout(() => {
        setContentStyle({
          ...transitionStyleRef.current,
          ...(afterEnterRef.current || {}),
        });
        setStatus(Status.activeEnter);
      }, 16);
    }

    return () => {
      timer !== undefined && window.clearTimeout(timer);
    };
  }, [status, visible]);

  useEffect(() => {
    if (status === Status.afterEnter && beforeLeaveRef.current && !visible) {
      setContentStyle({
        transition: '',
        ...(beforeLeaveRef.current || {}),
      });
      setStatus(Status.beforeLeave);
    }
  }, [status, visible]);

  useEffect(() => {
    let timer: number;
    if (
      (status === Status.beforeLeave && beforeLeaveRef.current && !visible) ||
      (status === Status.afterEnter && !beforeLeaveRef.current && !visible)
    ) {
      timer = window.setTimeout(() => {
        setContentStyle({
          ...transitionStyleRef.current,
          ...(afterLeaveRef.current || {}),
        });
        setStatus(Status.activeLeave);
      }, 16);
    }

    return () => {
      timer !== undefined && window.clearTimeout(timer);
    };
  }, [status, visible]);

  useEffect(() => {
    let timer: number;
    const transitionCb = () => {
      // 进场动画结束
      if (status === Status.activeEnter) {
        setStatus(Status.afterEnter);
      }

      // 退场动画结束
      if (status === Status.activeLeave) {
        timer = window.setTimeout(() => {
          setStatus(Status.afterLeave);
          setAnimationVisible(false);
        }, 50);
      }
    };
    const target = ref.current;

    target?.addEventListener('transitionend', transitionCb);
    return () => {
      target?.removeEventListener('transitionend', transitionCb);
      timer !== undefined && window.clearTimeout(timer);
    };
  }, [status]);

  useEffect(() => {
    if (!animationVisible && status === Status.afterLeave) {
      setContentStyle({});
      afterCloseRef.current?.();
    }
  }, [animationVisible, status]);

  return children && ((removeOnLeave && animationVisible) || !removeOnLeave)
    ? children(
        {
          style: {
            ...contentStyle,
            display: animationVisible ? undefined : 'none',
          },
        },
        ref,
      )
    : null;
};

Transition.defaultProps = {
  transitionActive: {
    transition: 'all .3s cubic-bezier(0.645, 0.045, 0.355, 1) 0s',
  },
};

export default Transition;
