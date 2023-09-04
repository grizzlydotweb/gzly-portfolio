import {registerBlockType} from "@wordpress/blocks";
import {InspectorControls, useBlockProps} from "@wordpress/block-editor";
import {useEffect, useState} from "react";
import {
    __experimentalToolsPanel as ToolsPanel,
    __experimentalToolsPanelItem as ToolsPanelItem, RangeControl,
    SelectControl, ToggleControl
} from "@wordpress/components";

import blockJson from "../block.json"
import './styles/styles.scss'
import {__} from "@wordpress/i18n";
import App from "./frontend/App";
import {useParentCategories} from "./frontend/api/backend";

const {
    name
} = blockJson;

// Register the block
registerBlockType(name, {
    edit: (props) => {
        var currentParentCategorySlug;
        const blockProps = useBlockProps();
        const categories = useParentCategories();
        const {
            attributes: {
                settings
            },
            setAttributes
        } = props;

        const defaultSettings = settings !== null && settings !== void 0 ? settings : {
            enable_categories: true,
            parent_category: null,
            category_width: 150,
            row_height: 300
        };

        const [data, setData] = useState(defaultSettings);
        useEffect(() => {
            setAttributes({
                settings: data
            });
        }, [data]);

        useEffect(() => {
            if (categories && categories.length <= 1) {
                setData({
                    ...data,
                    parent_category: categories[0]
                });
            }
        }, [categories]);

        let options = [{
            label: __('none'),
            value: null
        }];

        if (categories) {
            options = [...options, ...categories?.map(cat => {
                return {
                    label: cat.title,
                    value: cat.slug
                };
            })];
        }

        return (
            <div {...blockProps}>
                <InspectorControls key={'setting'}>
                    <ToolsPanel
                        label={__('Base')}
                        resetAll={() => setData(defaultSettings)}
                    >
                        <ToolsPanelItem
                            isShownByDefault
                            hasValue={!!data.parent_category}
                        >
                            <SelectControl
                                label={__('Choose parent category')}
                                value={(currentParentCategorySlug = data.parent_category?.slug) ? currentParentCategorySlug : null}
                                onChange={value => {
                                    let category = categories.find(cat => cat.slug === value);
                                    setData({
                                        ...data,
                                        parent_category: category
                                    })
                                }}
                                options={options}
                            ></SelectControl>
                        </ToolsPanelItem>

                        <ToolsPanelItem
                            isShownByDefault
                            hasValue={!!data.parent_category}
                        >
                            <RangeControl
                                label={__('Row Height')}
                                value={data.row_height}
                                onChange={value => setData({
                                    ...data,
                                    row_height: value
                                })}
                                min={100}
                                max={1000}
                            ></RangeControl>
                        </ToolsPanelItem>
                    </ToolsPanel>
                    <ToolsPanel
                        label={__('Base')}
                        resetAll={() => setData(defaultSettings)}
                    >
                        <ToolsPanelItem
                            isShownByDefault
                            hasValue={!!data.parent_category}
                        >
                            <SelectControl
                                label={__('Choose parent category')}
                                value={(currentParentCategorySlug = data.parent_category?.slug) !== null && currentParentCategorySlug !== void 0 ? currentParentCategorySlug : null}
                                onChange={value => {
                                    let category = categories.find(cat => cat.slug === value);
                                    setData({
                                        ...data,
                                        parent_category: category
                                    })
                                }}
                                options={options}
                            ></SelectControl>
                        </ToolsPanelItem>

                        <ToolsPanelItem
                            isShownByDefault
                            hasValue={() => !!data.enable_categories}
                            label={__('Enable Filter')}
                        >
                            <ToggleControl
                                label={__('Enable')}
                                value={data.enable_categories}
                                onChange={ () => setData({
                                    ...data,
                                    enable_categories: !data.enable_categories
                                })}
                            ></ToggleControl>
                        </ToolsPanelItem>

                        <ToolsPanelItem
                            isShownByDefault={data.enable_categories}
                            hasValue={() => !!data.category_dimensions}
                            label={__('Category Dimensions')}
                        >
                            <RangeControl
                                label={__('Dimensions')}
                                value={data.category_dimensions}
                                onChange={ value => setData({
                                    ...data,
                                    category_dimensions: value
                                })}
                                min={10}
                                max={320}
                            ></RangeControl>
                        </ToolsPanelItem>


                    </ToolsPanel>
                </InspectorControls>
                <App settings={data} demoMode={true} />
            </div>
        )
    },
    save: (props) => {
        const blockProps = useBlockProps.save()
        return (
            <div {...blockProps}>
                <div className="gzly-hauptsache-portfolio-placeholder" data-settings={JSON.stringify(props.attributes.settings)}></div>
            </div>
        )
    }
});
