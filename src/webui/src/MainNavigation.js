import { createSwitchNavigator, createAppContainer } from 'react-navigation';
import ScreensCustomer from './customer/navigation/Screens'
import ScreensVendor from './vendor/navigation/Screens'
import ScreensInstitution from './institution/navigation/Screens'
import ScreensCaterer from './caterer/navigation/Screens'
import Onboarding from './Onboarding'
export default createAppContainer(createSwitchNavigator(
    {
        Onboard: Onboarding,
      Customer: ScreensCustomer,
      Vendor: ScreensVendor,
      Institution: ScreensInstitution,
      Caterer: ScreensCaterer
    },
    {
        initialRouteName: 'Onboard',
    }
  ));