'use client'

import { useEffect, useState } from 'react'

export function useFormHydration() {
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  return isHydrated;
}
