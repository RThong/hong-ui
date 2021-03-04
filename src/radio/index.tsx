import React from 'react';
import InternalRadio, { RadioProps } from './Radio';
import Group from './Group';

interface CompoundedComponent
  extends React.ForwardRefExoticComponent<
    RadioProps & React.RefAttributes<HTMLInputElement>
  > {
  Group: typeof Group;
}

const Radio = InternalRadio as CompoundedComponent;

Radio.Group = Group;

export default Radio;
