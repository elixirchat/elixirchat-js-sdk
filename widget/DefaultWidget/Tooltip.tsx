import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {injectIntl, FormattedDate} from 'react-intl'

export interface IDefaultWidgetTooltipProps {
  title: string;
  placement?: string;
  className?: string;
  center?: boolean;
}

export interface IDefaultWidgetTooltipState {}

class TooltipComponent extends Component<IDefaultWidgetTooltipProps, IDefaultWidgetTooltipState> {

  tooltip = null;
  targetRef = React.createRef();

  componentDidUpdate(prevProps){
    const { title } = this.props;
    if (title !== prevProps.title && this.tooltip) {
      this.tooltip.innerText = title;
    }
  }

  onTargetMouseEnter = () => {
    if (!this.tooltip) {
      this.tooltip = this.createTooltip();
    }
    if (this.tooltip) {
      this.tooltip.hidden = false;
    }
  };

  onTargetMouseLeave = () => {
    if (this.tooltip) {
      this.tooltip.hidden = true;
    }
  };

  createTooltip = () => {
    if (!this.targetRef.current) {
      return null;
    }
    const { title, className, center } = this.props;
    const tooltip = document.createElement('div');
    tooltip.classList.add('elixirchat-tooltip', className);
    if (center) {
      tooltip.classList.add('elixirchat-tooltip--center');
    }
    tooltip.innerText = title;
    this.targetRef.current.appendChild(tooltip);
    return tooltip;
  };

  render() {
    const {
      title,
      className,
      children,
      ...otherProps
    } = this.props;

    const passedProps = {
      ...otherProps,
      ref: this.targetRef,
      onMouseEnter: this.onTargetMouseEnter,
      onMouseLeave: this.onTargetMouseLeave,
    };
    return React.cloneElement(children, passedProps);
  }
}

export const Tooltip = injectIntl(TooltipComponent);