import BasicInputEditable from "@/components/ContentEditing/FieldTypes/BasicInput.vue";
import BasicInputMock from "@/components/TemplateEditing/FieldTypes/BasicInputMock.vue";

import DropdownInputEditable from "@/components/ContentEditing/FieldTypes/DropdownInput.vue";
import DropdownInputMock from "@/components/TemplateEditing/FieldTypes/DropdownInput.vue";

import RadioInputEditable from "@/components/ContentEditing/FieldTypes/RadioInput.vue";
import RadioInput from "@/components/TemplateEditing/FieldTypes/RadioInput.vue";

import ChildComponentInput from "@/components/ContentEditing/FieldTypes/ChildComponentInput.vue";
import UploadInputEditable from "@/components/ContentEditing/FieldTypes/UploadInput.vue";


// Metacomponents
import NameCodename from "@/components/TemplateEditing/MetaComponents/NameCodename.vue";
import KeyValueOptions from "@/components/TemplateEditing/MetaComponents/KeyValueOptions.vue";
import OneToOne from "@/components/TemplateEditing/MetaComponents/OneToOne.vue";
import FieldsToDisplay from "@/components/TemplateEditing/MetaComponents/FieldsToDisplay.vue";
import UploadAttributes from "@/components/TemplateEditing/MetaComponents/UploadAttributes.vue";


const fieldTypes = [
    {
        id: 1,
        name: "Text Input",
        type: "text",
        layoutComponent: BasicInputMock,
        editingComponent: BasicInputEditable,
        icon: "mdi-format-text",
        description: "Simple text field",
        metaComponents: [
            NameCodename
        ],
    },
    {
        id: 2,
        name: "Number",
        layoutComponent: BasicInputMock,
        editingComponent: BasicInputEditable,
        icon: "mdi-pound",
        description: "Basic numbers",
        metaComponents: [
            NameCodename
        ]
    },
    {
        id: 3,
        name: "Date",
        type: "date",
        layoutComponent: BasicInputMock,
        editingComponent: BasicInputEditable,
        icon: "mdi-calendar",
        description: "Date picker, or date time",
        metaComponents: [
            NameCodename
        ]
    },
    {
        id: 4,
        name: "Radio Input (Yes / No)",
        layoutComponent: RadioInput,
        editingComponent: RadioInputEditable,
        icon: "mdi-toggle-switch",
        description: "Basic yes/no field",
        metaComponents: [
            NameCodename
        ]
    },
    {
        id: 5,
        name: "Dropdown (Static)",
        layoutComponent: DropdownInputMock,
        editingComponent: DropdownInputEditable,
        icon: "mdi-form-dropdown",
        description: "Choose an item from a list of static options",
        metaComponents: [
            NameCodename,
            KeyValueOptions
        ]
    },
    {
        id: 6,
        name: "Dropdown (Related Item)",
        layoutComponent: DropdownInputMock,
        editingComponent: DropdownInputEditable,
        icon: "mdi-form-dropdown",
        description: "Choose an items from another data source in your project",
        metaComponents: [
            NameCodename,
            OneToOne
        ]
    },
    {
        id: 7,
        name: "Connected Data",
        layoutComponent: BasicInputMock,
        editingComponent: ChildComponentInput,
        icon: "mdi-layers-triple",
        description: "Connect your record to multiple other records (for example: participants, ingredients, bill of materials)",
        metaComponents: [
            NameCodename,
            OneToOne,
            FieldsToDisplay
        ]
    },
    {
        id: 8,
        name: "File / Image Upload",
        layoutComponent: BasicInputMock,
        editingComponent: UploadInputEditable,
        icon: "mdi-file-image",
        description: "Upload images, documents, or other files related to your data",
        metaComponents: [
            NameCodename,
            UploadAttributes
        ]
    }

];

export default fieldTypes