import {useCallback, useEffect, useState} from "react"
import {Button, ButtonGroup, DropZone} from "@wordpress/components"
import {__} from "@wordpress/i18n"

import "@wordpress/media-utils";
import {MediaUpload} from "@wordpress/media-utils";

const ALLOWED_MEDIA_TYPES = 'image'

const ImageControl = ({image, onFilesUploaded}) => {
    if (!onFilesUploaded) {
        onFilesUploaded = () => {}
    }

    const [currentImage, setCurrentImage] = useState(false);
    const [isDragging, setDragging] = useState(false);
    const [height, setHeight] = useState(150);

    useEffect(() => {
        setCurrentImage(image);
    }, [image])

    const onContainerChange = useCallback((node) => {
        if (!node) {
            return;
        }
        setHeight(getComputedStyle(node)?.width ?? 150)
    }, [])

    const onFilesDragEnter = (e) => setDragging(true)
    const onFilesDragLeave = (e) => setDragging(true)
    const onFilesDrop = (files) => {
        wp.mediaUtils.uploadMedia( {
            filesList: files,
            onFileChange: (medias) => {
                if (medias.length <= 0 || !medias[0].hasOwnProperty('id')) {
                    return;
                }
                onFilesUploaded(medias)
                if (medias.length === 1) {
                    return setCurrentImage(medias[0])
                }
            },
            onError: (e) => {
                console.log('file drop error', e)
            },
        } );
    }

    let output = (
        <>
            <DropZone
                className={isDragging ? 'absolute bg-gradient-to-l from-cyan-500 to-blue-500 h-full w-full' : 'absolute bg-gradient-to-r from-cyan-500 to-blue-500 h-full w-full'}
                style={{ height: height }}
                onFilesDrop={onFilesDrop}
                onDragEnter={onFilesDragEnter}
                onDragLeave={onFilesDragLeave}
            />
        </>
    );
    if (currentImage) {
        let thumbnail = currentImage.media_details.sizes.medium
        let src = thumbnail.source_url

        output = (
            <div className={`bg-center bg-no-repeat bg-contain`} style={{
                width: '100%',
                height: '100%',
                backgroundImage: `url('${src}')`,
            }}></div>
        )
    }


    return (
        <div ref={onContainerChange} className={'m-4 relative'} style={{height: height}}>
            {output}
        </div>
    )
}

export default function MediaUploadControl({ imageId, onChange, className }) {
    const [id, setId] = useState(imageId)
    const [media, setMedia] = useState(null)

    useEffect(() => {
        if (!imageId) {
            return;
        }

        const mediaModel = new wp.api.models['Media']({id: imageId});
        mediaModel.fetch().then((image) => {
            setMedia(image)
        })
    }, [imageId])

    return (
        <div className={className+' bg-current flex flex-col gap-2'}>
            <ImageControl
                image={media}
            />
            <ButtonGroup>
                <MediaUpload
                    onSelect={ ( media ) => {
                        const mediaModel = new wp.api.models['Media']({id: media.id});
                        mediaModel.fetch().then((image) => {
                            setMedia(image)
                            if (onChange) {
                                onChange(image)
                            }
                        });
                    }}
                    allowedTypes={ ALLOWED_MEDIA_TYPES }
                    value={ media?.id }
                    render={ ( { open } ) => (
                        <Button onClick={ open }>Open Media Library</Button>
                    ) }
                />
                <Button onClick={(e) => {
                    frame.open();
                }} >{__('Upload', 'gzly-portfolio')}</Button>
            </ButtonGroup>
        </div>
    );

}
