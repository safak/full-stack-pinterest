import React from 'react';
import { Image, ImageKitProvider } from '@imagekit/react';

const PinImage = ({src,w,h}) => {
    return (
        <ImageKitProvider urlEndpoint="https://ik.imagekit.io/fdiixpf5c">
            <Image
                src={src}
                width={w}
                height={h}
                alt="Picture of the author"
            />
        </ImageKitProvider>
    )
}

export default PinImage