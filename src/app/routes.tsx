import { createBrowserRouter } from 'react-router';
import Root from './screens/Root';
import OnboardingScreen from './screens/OnboardingScreen';
import ScannerScreen from './screens/ScannerScreen';
import ScanResultsScreen from './screens/ScanResultsScreen';
import HistoryScreen from './screens/HistoryScreen';
import ProfileScreen from './screens/ProfileScreen';
import AllergenAlertScreen from './screens/AllergenAlertScreen';
import HealthSetupScreen from './screens/HealthSetupScreen';
import LabelCropScreen from './screens/LabelCropScreen';
import OcrProcessingScreen from './screens/OcrProcessingScreen';
import LabelScanResultsScreen from './screens/LabelScanResultsScreen';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Root,
    children: [
      { index: true, Component: OnboardingScreen },
      { path: 'scanner', Component: ScannerScreen },
      { path: 'results', Component: ScanResultsScreen },
      { path: 'history', Component: HistoryScreen },
      { path: 'profile', Component: ProfileScreen },
      { path: 'allergen-alert', Component: AllergenAlertScreen },
      { path: 'health-setup', Component: HealthSetupScreen },
      { path: 'label-crop', Component: LabelCropScreen },
      { path: 'ocr-processing', Component: OcrProcessingScreen },
      { path: 'label-results', Component: LabelScanResultsScreen },
    ],
  },
], {
  basename: import.meta.env.BASE_URL
});
