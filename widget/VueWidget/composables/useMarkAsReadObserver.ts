type MarkAsReadMessage = {
  id: string | number;
  isUnread?: boolean;
};

type UseMarkAsReadObserverParams = {
  markAsReadTimeoutMs?: number;
  onMarkAsRead: (messageId: string) => void;
};

export function useMarkAsReadObserver(params: UseMarkAsReadObserverParams) {
  const {
    markAsReadTimeoutMs = 2000,
    onMarkAsRead
  } = params;

  let observer: IntersectionObserver | null = null;
  const messageElements = new Map<string, HTMLElement>();
  const elementToMessageId = new WeakMap<HTMLElement, string>();
  const isUnreadByMessageId = new Map<string, boolean>();
  const isWithinViewportByMessageId = new Map<string, boolean>();
  const markAsReadTimeoutsByMessageId = new Map<string, ReturnType<typeof setTimeout>>();

  function clearMarkAsReadTimeout(messageId: string) {
    const timeout = markAsReadTimeoutsByMessageId.get(messageId);
    if (!timeout) {
      return;
    }
    clearTimeout(timeout);
    markAsReadTimeoutsByMessageId.delete(messageId);
  }

  function scheduleMarkAsRead(messageId: string) {
    if (!isUnreadByMessageId.get(messageId) || markAsReadTimeoutsByMessageId.has(messageId)) {
      return;
    }
    const timeout = setTimeout(() => {
      markAsReadTimeoutsByMessageId.delete(messageId);
      if (!isUnreadByMessageId.get(messageId)) {
        return;
      }
      if (!isWithinViewportByMessageId.get(messageId)) {
        return;
      }
      onMarkAsRead(messageId);
    }, markAsReadTimeoutMs);
    markAsReadTimeoutsByMessageId.set(messageId, timeout);
  }

  function onIntersection(entries: IntersectionObserverEntry[]) {
    entries.forEach((entry) => {
      const element = entry.target as HTMLElement;
      const messageId = elementToMessageId.get(element);
      if (!messageId) {
        return;
      }

      if (entry.isIntersecting) {
        isWithinViewportByMessageId.set(messageId, true);
        scheduleMarkAsRead(messageId);
      } else {
        isWithinViewportByMessageId.set(messageId, false);
        clearMarkAsReadTimeout(messageId);
      }
    });
  }

  function reattach() {
    if (!observer) {
      return;
    }
    messageElements.forEach((element) => {
      observer!.observe(element);
    });
  }

  function initialize(root: HTMLElement) {
    cleanup();
    observer = new IntersectionObserver(onIntersection, {
      root,
      threshold: 0.9
    });
    reattach();
  }

  function syncMessages(messages: MarkAsReadMessage[]) {
    const activeIds = new Set<string>();
    messages.forEach((message) => {
      const messageId = String(message.id);
      activeIds.add(messageId);
      const isUnread = Boolean(message.isUnread);
      isUnreadByMessageId.set(messageId, isUnread);

      if (!isUnread) {
        clearMarkAsReadTimeout(messageId);
        return;
      }
      if (isWithinViewportByMessageId.get(messageId)) {
        scheduleMarkAsRead(messageId);
      }
    });

    Array.from(isUnreadByMessageId.keys()).forEach((messageId) => {
      if (!activeIds.has(messageId) && !messageElements.has(messageId)) {
        isUnreadByMessageId.delete(messageId);
        isWithinViewportByMessageId.delete(messageId);
        clearMarkAsReadTimeout(messageId);
      }
    });
  }

  function setMessageRef(messageIdRaw: string | number, isUnread: boolean, element: HTMLElement | null) {
    const messageId = String(messageIdRaw);
    isUnreadByMessageId.set(messageId, Boolean(isUnread));

    if (!element) {
      const prevElement = messageElements.get(messageId);
      if (prevElement && observer) {
        observer.unobserve(prevElement);
      }
      if (prevElement) {
        elementToMessageId.delete(prevElement);
      }
      messageElements.delete(messageId);
      isWithinViewportByMessageId.delete(messageId);
      clearMarkAsReadTimeout(messageId);
      return;
    }

    const prevElement = messageElements.get(messageId);
    if (prevElement && prevElement !== element && observer) {
      observer.unobserve(prevElement);
    }

    messageElements.set(messageId, element);
    elementToMessageId.set(element, messageId);
    isWithinViewportByMessageId.set(messageId, false);

    if (observer) {
      observer.observe(element);
    }
  }

  function cleanup() {
    if (observer) {
      observer.disconnect();
      observer = null;
    }
    markAsReadTimeoutsByMessageId.forEach((timeout) => clearTimeout(timeout));
    markAsReadTimeoutsByMessageId.clear();
    isWithinViewportByMessageId.clear();
  }

  return {
    initialize,
    cleanup,
    reattach,
    syncMessages,
    setMessageRef
  };
}

