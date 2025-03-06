import "./skeleton.css";

const Skeleton = () => {
  return (
    <div className="skeleton-masonry">
      {Array.from({ length: 21 }).map((_, index) => (
        <div key={index} className={`skeleton-item size-${(index % 5) + 1}`} />
      ))}
    </div>
  );
};

export default Skeleton;
