import { Routes, Route } from 'react-router-dom';
import { LinksTab } from '../Links/LinksTab';
import { BioTab } from '../Bio/BioTab';
import { StyleTab } from '../Style/StyleTab';
import { AnalyticsTab } from '../Analytics/AnalyticsTab';
import { SettingsTab } from '../Settings/SettingsTab';

export function DashboardRoutes() {
  return (
    <Routes>
      <Route path="links" element={<LinksTab />} />
      <Route path="bio" element={<BioTab />} />
      <Route path="style" element={<StyleTab />} />
      <Route path="analytics" element={<AnalyticsTab />} />
      <Route path="settings" element={<SettingsTab />} />
    </Routes>
  );
}