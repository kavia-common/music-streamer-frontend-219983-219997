import React, { createContext, useContext, useMemo, useState } from 'react';

const UiContext = createContext(null);

// PUBLIC_INTERFACE
export function UiProvider({ children }) {
  /** Provides UI state such as sidebar collapse and mini player mode. */
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMiniPlayer, setIsMiniPlayer] = useState(false);

  const value = useMemo(
    () => ({
      isSidebarCollapsed,
      setIsSidebarCollapsed,
      isMiniPlayer,
      setIsMiniPlayer
    }),
    [isSidebarCollapsed, isMiniPlayer]
  );

  return <UiContext.Provider value={value}>{children}</UiContext.Provider>;
}

// PUBLIC_INTERFACE
export function useUi() {
  /** Hook to access UI context. */
  const ctx = useContext(UiContext);
  if (!ctx) throw new Error('useUi must be used within UiProvider');
  return ctx;
}
