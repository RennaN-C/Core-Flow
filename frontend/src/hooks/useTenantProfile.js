import { useContext } from 'react';
import { TenantProfileContext } from '../context/TenantProfileContext';

export const useTenantProfile = () => useContext(TenantProfileContext);
