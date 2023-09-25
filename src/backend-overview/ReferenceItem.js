import {useRef, useState} from "react";
import {Button, ButtonGroup,} from "@wordpress/components";
import {__} from "@wordpress/i18n";
import {cleanForSlug} from '@wordpress/url';
import MediaUploadControl from "../wp-components/MediaUploadControl";

const CategorySelectControl = () => {
    const [item, setItem] = useState('');

    return (
        <SelectInput
            label={__('Select an item:')}
            value={item} // e.g: value = 'a'
            onChange={(selection) => {
                setItem(selection)
            }}
            options={[
                { label: 'Obst', value: 'obst', disabled: true, options: [
                        { value: 'banane', label: 'Banane', disabled: true },
                        { value: 'apfel', label: 'Apfel',
                            options: [
                                { value: 'cox-orange', label: 'Cox Orange' },
                                { value: 'braeburn', label: 'Braeburn' },
                            ]
                        },
                        { value: 'birne', label: 'Birne' },
                    ]
                },
                { value: 'gemuese', label: 'Gemüse' },
                { value: 'fleisch', label: 'Fleisch' },
            ] }
        >
        </SelectInput>
    )
}

const BaseInput = ({className, id, label, small, children}) => {
    let labelClasses = 'block text-gray-700 uppercase font-bold';

    if (small) {
        labelClasses = labelClasses + '  text-xs';
    } else {
        labelClasses = labelClasses + '  text-sm';
    }

    return (
        <div className={className} >
            <label className={labelClasses} htmlFor={id}>
                {__(label)}
            </label>
            {children}
        </div>
    )

}

const TextInput = (props) => {

    const {small, id, value, placeholder, onFocus, onChange} = props;
    let inputClasses = 'shadow appearance-none border rounded text-gray-700 leading-tight focus:outline-none focus:shadow-outline';

    if (small) {
        inputClasses = inputClasses + '  py-1 px-1 w-4/5';
    } else {
        inputClasses = inputClasses + '  py-2 px-3 w-full';
    }

    return (
        <BaseInput
            {...props}
        >
            <input
                id={id}
                value={value}
                onFocus={onFocus}
                onChange={onChange}
                type="text"
                placeholder={placeholder}
                className={inputClasses}
            />
        </BaseInput>
    )
}

const SelectInput = (props) => {

    const {small, id, value, placeholder, onFocus, onChange, options} = props;
    let inputClasses = 'shadow appearance-none border rounded text-gray-700 leading-tight focus:outline-none focus:shadow-outline';

    if (small) {
        inputClasses = inputClasses + '  py-1 px-1 w-4/5';
    } else {
        inputClasses = inputClasses + '  py-2 px-3 w-full';
    }

    const change = function (option, parent) {
        console.log('change select', option, parent)
    }

    const renderItems = (options, optionPath) => {
        return options.map((option) => {
            let currentPath = optionPath ?? []
            currentPath.push(option.value)
            return (
                <div key={option.value}>
                    <div>
                        <div onClick={() => change(option, currentPath)}>{option.label}</div>
                        {option.options && renderList(option.options, currentPath)}
                    </div>
                </div>
            )
        });
    }

    const renderList = (options, optionPath) => {
        return (
            <div
                id={id}
                placeholder={placeholder}
                className={inputClasses}
            >
                <div className={'flex flex-col bg-white'}>
                    {renderItems(options, optionPath)}
                </div>
            </div>
        )
    }

    return (
        <BaseInput
            {...props}
        >
            {renderList(options)}
        </BaseInput>
    )
}

export default function ReferenceItem({item, isNew}) {
    let slugIsTouched = useRef(false)
    let initialPost = {
        featured_media: null,
        categories: [],
        ...item,
        title: item?.title.rendered ?? ''
    }
    const [post, setPost] = useState(initialPost)

    let dirty = useRef(false)
    const updatePost = (newPost) => {
        dirty.current = true;
        setPost({
            ...post,
            ...newPost
        })
    }

    const savePost = () => {
        post.slug = cleanForSlug(post.slug)
        const postModel = new wp.api.models['Gzly_portfolio'](post)
        postModel.save().done((response) => {
            console.log('saved', response)
        })
    }

    const topBarColor = (!isNew) ? 'gzly-primary': 'gzly-light-background';
    const opacity = (!isNew || dirty.current) ? 'opacity-100': 'opacity-75 hover:opacity-100';
    return (
        <div className={`${'bg-'+topBarColor} `}>
            <div className={`flex-none text-white flex justify-center`}>
                {isNew && <span className={'block bold text-gzly-light-foreground self-start'}>{__('New')}</span>}
                <div className={'flex flex-row-reverse'}>
                    {!isNew && (<a href={`/wp-admin/post.php?post=${post.id}&action=edit`}>Edit</a>)}
                </div>
            </div>
            <div className={`bg-white m-1 p-4 flex flex-col gap-1 hover:transition-all ${opacity}`}>
                <div>
                    <div>
                        <TextInput
                            className={'mb-1'}
                            onChange={(e) => updatePost({title: e.target.value})}
                            id={post.id + '-title'}
                            label={__('Title')}
                            placeholder={__('Title')}
                            value={post.title}
                        />
                        <TextInput
                            small
                            className={'mb-4'}
                            onFocus={(e) => {
                                slugIsTouched.current = true
                            }}
                            onChange={(e) => updatePost({slug: e.target.value})}
                            id={post.id + '-slug'}
                            label={__('Slug')}
                            placeholder={__('Slug')}
                            value={(isNew && !slugIsTouched.current) ? cleanForSlug(post.title) : post.slug}
                        />
                    </div>
                </div>
                <div className={'grow'}>
                    <MediaUploadControl
                        className={'mb-4'}
                        imageId={post.featured_media}
                        onChange={image => {
                            updatePost({
                                featured_media: image.id
                            })
                        }
                        }/>
                    <CategorySelectControl />
                </div>
                <div  className={'mt-4'}>
                    <ButtonGroup>
                        {dirty.current && (<Button className={'bg-gzly-light-background text-gzly-light-foreground'} onClick={() => setPost(initialPost)} variant="primary">{__('Rest')}</Button>)}
                        {dirty.current && (<Button className={'bg-gzly-accent'} onClick={savePost} variant="primary">{__('Save')}</Button>)}
                    </ButtonGroup>
                </div>
            </div>
        </div>
    )
};
