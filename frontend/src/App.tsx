import { Route } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import { CalendarPage } from './pages/CalendarPage';
import { TimeTablePage } from './pages/TimeTablePage';
import LoginPage from './pages/LoginPage';
type Props = {};
const App = (props: Props) => {
  return (
    <>
      <Route component={CalendarPage} path="/" exact />
      <Route component={AuthPage} path="/register" />
      <Route component={LoginPage} path="/login" />
      <Route component={TimeTablePage} path="/timetable" />
    </>
  );
};

export default App;
