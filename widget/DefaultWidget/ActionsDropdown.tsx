import React, { useState, useRef, useCallback } from 'react';
import { cn } from '../../utilsCommon';

export interface ActionsDropdownProps {
  onAttachFile: () => void;
  onScreenshot: () => void;
  screenshotAvailable: boolean;
  screenshotLabel: string;
  attachFileLabel: string;
}

export function ActionsDropdown({
  onAttachFile,
  onScreenshot,
  screenshotAvailable,
  screenshotLabel,
  attachFileLabel,
}: ActionsDropdownProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLDivElement>) => {
      const next = e.relatedTarget;

      if (!next || !containerRef.current?.contains(next)) {
        setOpen(false);
      }
    },
    []
  );

  const handleScreenshotClick = useCallback(() => {
    setOpen(false);
    onScreenshot();
  }, [onScreenshot]);

  const handleAttachFileClick = useCallback(() => {
    setOpen(false);
    onAttachFile();
  }, [onAttachFile]);

  return (
    <div
      ref={containerRef}
      className={cn(
        'elixirchat-chat-textarea__actions',
        'elixirchat-chat-textarea__actions-dropdown-wrap'
      )}
      onBlur={handleBlur}
      tabIndex={-1}
    >
      <span
        className={cn('elixirchat-chat-textarea__actions-button', 'elixirchat-chat-textarea__actions-dropdown-trigger', {
          'elixirchat-chat-textarea__actions-dropdown-trigger--open': open,
        })}
      >
        <button
          type="button"
          className="elixirchat-chat-textarea__actions-dropdown-btn"
          onClick={() => setOpen(o => !o)}
        >
          <i className="icon-file" />
        </button>

        {open && (
          <div className="elixirchat-chat-textarea__actions-dropdown-menu">
            <button
              type="button"
              className="elixirchat-chat-textarea__actions-dropdown-item"
              onClick={handleAttachFileClick}
            >
              <i className="icon-download" />
              <span>{attachFileLabel}</span>
            </button>
            {screenshotAvailable && (
              <button
                type="button"
                className="elixirchat-chat-textarea__actions-dropdown-item"
                onClick={handleScreenshotClick}
              >
                <i className="icon-screenshot" />
                <span>{screenshotLabel}</span>
              </button>
            )}
          </div>
        )}
      </span>
    </div>
  );
}
