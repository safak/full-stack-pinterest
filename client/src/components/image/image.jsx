import { IKImage } from "imagekitio-react";

const Image = ({ path, w, h, alt = "", className = "" }) => {
  const isValidPath = path && path.trim() !== "";

  if (!isValidPath) {
    return <img src="/general/noAvatar.png" alt={alt} className={className} />;
  }

  return (
    <IKImage
      path={path}
      transformation={w && h ? [{ width: w, height: h }] : []}
      loading="lazy"
      lqip={{ active: true }}
      alt={alt}
      className={className}
    />
  );
};

export default Image;
