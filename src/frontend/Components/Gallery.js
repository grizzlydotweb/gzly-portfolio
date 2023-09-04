import {useEffect, useRef, useState} from "react";
import {Gallery as ReactGridGallery} from "react-grid-gallery"
import PhotoSwipeLightbox from "photoswipe/lightbox";

const ImageComponent = props => {
    return (
        <div
            style={{
                ...props.imageProps.style,
                textAlign: "center"
            }}
        ><img {...props.imageProps} /></div>
    )
};
export default function Gallery({
     galleryProps = {},
     lightboxProps = {},
     images = null
 }) {
    const [index, setIndex] = useState(-1);
    const gallery = useRef();
    let lightbox = null;
    useEffect(() => {
        if (!images) {
            return;
        }
        const backEasing = {
            in: 'cubic-bezier(0.6, -0.28, 0.7, 1)',
            out: 'cubic-bezier(0.3, 0, 0.32, 1.275)',
            inOut: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
        };
        lightbox = new PhotoSwipeLightbox({
            ...lightboxProps,
            index: index,
            dataSource: images.map(image => {
                const originalImage = image.reference.sizes.original;
                const element = gallery.current?.querySelectorAll('.ReactGridGallery_tile img')[index];
                return {
                    //srcset: 'https://dummyimage.com/1500x1000/555/fff/?text=1500x1000 1500w, https://dummyimage.com/1200x800/555/fff/?text=1200x800 1200w, https://dummyimage.com/600x400/555/fff/?text=600x400 600w',
                    src: originalImage.url,
                    msrc: image.src,
                    width: originalImage.width,
                    height: originalImage.height,
                    alt: image.alt,
                    element: element
                };
            }),
            pswpModule: () => import('photoswipe')
        });
        lightbox.on('firstUpdate', () => {
            lightbox.pswp.options.easing = backEasing.out;
        });
        lightbox.on('initialZoomInEnd', () => {
            lightbox.pswp.options.easing = backEasing.inOut;
        });
        lightbox.on('close', () => {
            lightbox.pswp.options.easing = backEasing.in;
        });
        lightbox.init();
        return () => {
            lightbox.destroy();
            lightbox = null;
        };
    }, [images, index]);
    useEffect(() => {
        lightbox?.loadAndOpen(index);
    }, [index]);
    if (!images) {
        return;
    }
    const handleClick = (i, item) => {
        setIndex(i);
    };

    return (
        <div ref={gallery}>
            <ReactGridGallery
                {...galleryProps}
                onClick={handleClick}
                images={images}
                thumbnailImageComponent={ImageComponent}
            />
        </div>
    )
}
