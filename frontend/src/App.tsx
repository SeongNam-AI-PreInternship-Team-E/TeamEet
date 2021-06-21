import * as React from 'react';
import SampleContainer from './components/SampleContainer';

import { useCalendar } from './hooks/useCalendar';
import { CalendarContainer } from './components/CalendarContainer';
type Props = {};
const App = (props: Props) => {
  return (
    <>
      <CalendarContainer />
    </>
  );
};

export default App;
