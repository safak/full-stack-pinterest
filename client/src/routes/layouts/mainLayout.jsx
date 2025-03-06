import { Outlet } from "react-router";
import LeftBar from "../../components/leftBar/leftBar";
import TopBar from "../../components/topBar/topBar";
import "./mainLayout.css";

const MainLayout = () => {
  return (
    <div className="app">
      <LeftBar />
      <div className="content">
        <TopBar />
        <Outlet/>
      </div>
    </div>
  );
};

export default MainLayout;
