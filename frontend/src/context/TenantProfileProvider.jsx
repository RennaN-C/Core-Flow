import { useCallback, useEffect, useState } from 'react';
import resourceApi from '../services/resourceApi';
import { fallbackProfile, TenantProfileContext } from './TenantProfileContext';

export const TenantProfileProvider = ({ children }) => {
  const [tenant, setTenant] = useState(null);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(() => {
    setLoading(true);
    return resourceApi.get('/tenant').then(({ data }) => setTenant(data)).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let active = true;
    resourceApi.get('/tenant')
      .then(({ data }) => { if (active) setTenant(data); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  return <TenantProfileContext.Provider value={{ tenant, profile: tenant?.profile || fallbackProfile, loading, reload }}>{children}</TenantProfileContext.Provider>;
};
