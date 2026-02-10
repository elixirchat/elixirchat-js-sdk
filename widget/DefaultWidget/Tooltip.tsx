import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {injectIntl, FormattedDate} from 'react-intl'

export interface IDefaultWidgetTooltipProps {
  title: string;
  placement?: string;
  className?: string;
  center?: boolean;
  trigger?: 'hover' | 'click';
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
    if (!this.props.title) {
      return;
    }
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

  onTargetClick = () => {
    if (!this.props.title) {
      return;
    }
    if (!this.tooltip) {
      this.tooltip = this.createTooltip();
    }
    if (this.tooltip) {
      this.tooltip.hidden = false;
    }
  };

  createTooltip = () => {
    if (!this.targetRef.current) {
      return null;
    }
    const { title, className, center } = this.props;
    const tooltip = document.createElement('div');
    tooltip.classList.add('elixirchat-tooltip');
    if (className) {
      tooltip.classList.add(className);
    }
    if (center) {
      tooltip.classList.add('elixirchat-tooltip--center');
    }
    tooltip.innerText = title;
    tooltip.hidden = true;
    this.targetRef.current.appendChild(tooltip);
    return tooltip;
  };

  render() {
    const {
      title,
      className,
      center,
      trigger = 'hover',
      children,
      intl,
      ...otherProps
    } = this.props;

    const childProps: any = (children as any)?.props || {};

    const passedProps = {
      ...otherProps,
      ref: this.targetRef,
      onMouseEnter: trigger === 'hover'
        ? (e) => {
          childProps.onMouseEnter?.(e);
          this.onTargetMouseEnter();
        }
        : childProps.onMouseEnter,
      onMouseLeave: (trigger === 'hover' || trigger === 'click')
        ? (e) => {
          childProps.onMouseLeave?.(e);
          this.onTargetMouseLeave();
        }
        : childProps.onMouseLeave,
      onClick: trigger === 'click'
        ? (e) => {
          childProps.onClick?.(e);
          this.onTargetClick();
        }
        : childProps.onClick,
    };
    return React.cloneElement(children, passedProps);
  }
}

export const Tooltip = injectIntl(TooltipComponent);