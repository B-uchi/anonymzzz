import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { api } from "./api";

const POLL_MS = 30_000;

// Loads the inbox, refreshes it while the tab is visible, and applies
// read/star/delete changes optimistically.
export function useMessages() {
  const [messages, setMessages] = useState(null);
  const [error, setError] = useState(null);
  const knownIds = useRef(null);

  const refresh = useCallback(async ({ quiet = false } = {}) => {
    try {
      const data = await api("/messages", { auth: true });
      if (knownIds.current) {
        const fresh = data.messages.filter((m) => !knownIds.current.has(m.id)).length;
        if (fresh) toast(fresh === 1 ? "1 new note" : `${fresh} new notes`);
      }
      knownIds.current = new Set(data.messages.map((m) => m.id));
      setMessages(data.messages);
      setError(null);
    } catch (err) {
      if (!quiet) setError(err.message);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial fetch
    refresh();
    const tick = () => {
      if (document.visibilityState === "visible") refresh({ quiet: true });
    };
    const timer = setInterval(tick, POLL_MS);
    document.addEventListener("visibilitychange", tick);
    return () => {
      clearInterval(timer);
      document.removeEventListener("visibilitychange", tick);
    };
  }, [refresh]);

  const update = useCallback(async (id, changes) => {
    let previous;
    setMessages((list) => {
      previous = list;
      return list.map((m) => (m.id === id ? { ...m, ...changes } : m));
    });
    try {
      await api(`/messages/${id}`, { method: "PATCH", body: changes, auth: true });
    } catch (err) {
      setMessages(previous);
      toast.error(err.message);
    }
  }, []);

  const remove = useCallback(async (id) => {
    await api(`/messages/${id}`, { method: "DELETE", auth: true });
    knownIds.current?.delete(id);
    setMessages((list) => list.filter((m) => m.id !== id));
  }, []);

  const markAllRead = useCallback(async () => {
    let previous;
    setMessages((list) => {
      previous = list;
      return list.map((m) => ({ ...m, read: true }));
    });
    try {
      await api("/messages/read-all", { method: "POST", auth: true });
    } catch (err) {
      setMessages(previous);
      toast.error(err.message);
    }
  }, []);

  return { messages, error, refresh, update, remove, markAllRead };
}
