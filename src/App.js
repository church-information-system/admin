import './App.scss';
import Content from './components/content/content';
import NavBar from './components/navbar/navbar';
import SideBar from './components/sidebar/sidebar';

function App() {
  return (
    <div id="app">
      <NavBar />
      <main>
        <SideBar />
        <Content />
      </main>
    </div>
  );
}

export default App;
