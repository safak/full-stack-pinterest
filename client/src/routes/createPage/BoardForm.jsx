import Image from "../../components/image/image";

const BoardForm = ({ setIsNewBoardOpen, setNewBoard }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    const title = e.target[0].value;
    setNewBoard(title);
    setIsNewBoardOpen(false);
  };

  return (
    <div className="boardForm">
      <div className="boardFormContainer">
        <div
          className="boardFormClose"
          onClick={() => setIsNewBoardOpen(false)}
        >
          <Image path="/general/cancel.svg" alt="" w={20} h={20} />
        </div>
        <form onSubmit={handleSubmit}>
          <h1>Create a new board</h1>
          <input type="text" placeholder="Board Title" />
          <button>Create</button>
        </form>
      </div>
    </div>
  );
};

export default BoardForm;
