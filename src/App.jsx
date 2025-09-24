import "./app.css";
import Homepage from "./routes/homePage/HomePage.jsx"
import CreatePage from "./routes/createPage/createPage.jsx";
import PostPage from "./routes/postPage/postPage.jsx";
import ProfilePage from "./routes/profilePage/profilePage.jsx";
import SearchPage from "./routes/searchPage/searchPage.jsx";
import AuthPage from "./routes/authPage/authPage.jsx";
import {Routes, Route} from "react-router-dom"
import MainLayout from "./routes/layouts/MainLayout.jsx";

const App = () => {
  return (
    <div className="app">
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Homepage />} />
          <Route path="/create" element={<CreatePage />} />
          <Route path="/pin/:id" element={<PostPage />} />
          <Route path="/:username" element={<ProfilePage />} />
          <Route path="/search" element={<SearchPage />} />
        </Route>
        <Route path="/auth" element={<AuthPage />} />
      </Routes>
    </div>
  );
};

export default App;
