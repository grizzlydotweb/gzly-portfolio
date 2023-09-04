import {useStore} from "react-context-hook";

import {useReferences} from "../api/frontend";
import Gallery from "./Gallery";

export default function References({categories}) {
    const references = useReferences(categories);
    const [rowHeight] = useStore('row_height');
    const images = references?.map((ref, i) => {
        const image = ref.sizes['large'];
        return {
            index: i,
            src: image.url,
            width: image.width,
            height: image.height,
            alt: ref.title,
            reference: ref
        };
    });

    return (
        <Gallery
            images={images}
            lightboxProps={{
                showHideAnimationType: 'zoom',
                showAnimationDuration: 500,
                hideAnimationDuration: 500,
                wheelToZoom: true,
                closeOnVerticalDrag: true,
                clickToCloseNonZoomable: false
            }}
            galleryProps={{
                id: 'gzly-portfolio-gallery',
                rowHeight: rowHeight,
                defaultContainerWidth: 4000,
                enableImageSelection: false
            }}
        />
    )
}
