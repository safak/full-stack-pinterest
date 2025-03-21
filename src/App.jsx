import styles from "./app.module.css";
import Gallery from "./components/gallery/gallery";
import Leftbar from "./components/leftbar/leftbar";
import Topbar from "./components/topbar/topbar";

const App = () => {
  return (
    <div className={styles["app"]}>
      <Leftbar />
      <div className={styles["content"]}>
        <Topbar />
        <Gallery />
      </div>
    </div>
  );
};

export default App;
