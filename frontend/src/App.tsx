import { Route } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import { CalendarPage } from './pages/CalendarPage';
import { TimeTablePage } from './pages/TimeTablePage';
import LoginPage from './pages/LoginPage';
import { TeamTablePage } from './pages/TeamTablePage';
type Props = {};
const App = (props: Props) => {
  return (
    <>
      <Route component={CalendarPage} path={'/'} exact />
      <Route component={AuthPage} path={['/register/:url', '/register']} />
      <Route component={LoginPage} path={['/login/:url', '/login']} />
      <Route component={TimeTablePage} path={'/timetable'} />
      <Route component={TeamTablePage} path={'/teamTable'} />
    </>
  );
};

export default App;
