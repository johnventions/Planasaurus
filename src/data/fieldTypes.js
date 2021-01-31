// Layout Editing
import TextInput from "@/components/TemplateEditing/FieldTypes/TextInput.vue";
import DateInput from "@/components/TemplateEditing/FieldTypes/DateInput.vue";
import DropdownInput from "@/components/TemplateEditing/FieldTypes/DropdownInput.vue";
import RadioInput from "@/components/TemplateEditing/FieldTypes/RadioInput.vue";

// Content Editing
import BasicInputEditable from "@/components/ContentEditing/FieldTypes/BasicInput.vue";
// import TextInputEditable from "@/components/ContentEditing/FieldTypes/TextInput.vue";
// import DateInputEditable from "@/components/ContentEditing/FieldTypes/DateInput.vue";
import DropdownInputEditable from "@/components/ContentEditing/FieldTypes/DropdownInput.vue";
import RadioInputEditable from "@/components/ContentEditing/FieldTypes/RadioInput.vue";
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
        layoutComponent: TextInput,
        editingComponent: BasicInputEditable,
        icon: "font",
        description: "Simple text field",
        metaComponents: [
            NameCodename
        ],
    },
    {
        id: 2,
        name: "Number",
        layoutComponent: TextInput,
        editingComponent: BasicInputEditable,
        icon: "hashtag",
        description: "Basic numbers",
        metaComponents: [
            NameCodename
        ]
    },
    {
        id: 3,
        name: "Date",
        type: "date",
        layoutComponent: DateInput,
        editingComponent: BasicInputEditable,
        icon: "calendar-alt",
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
        icon: "toggle-on",
        description: "Basic yes/no field",
        metaComponents: [
            NameCodename
        ]
    },
    {
        id: 5,
        name: "Dropdown (Static)",
        layoutComponent: DropdownInput,
        editingComponent: DropdownInputEditable,
        icon: "caret-square-down",
        description: "Choose an item from a list of static options",
        metaComponents: [
            NameCodename,
            KeyValueOptions
        ]
    },
    {
        id: 6,
        name: "Dropdown (Related Item)",
        layoutComponent: DropdownInput,
        editingComponent: DropdownInputEditable,
        icon: "caret-square-down",
        description: "Choose an items from another data source in your project",
        metaComponents: [
            NameCodename,
            OneToOne
        ]
    },
    {
        id: 7,
        name: "Connected Data",
        layoutComponent: TextInput,
        editingComponent: ChildComponentInput,
        icon: "layer-group",
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
        layoutComponent: TextInput,
        editingComponent: UploadInputEditable,
        icon: "file-upload",
        description: "Upload images, documents, or other files related to your data",
        metaComponents: [
            NameCodename,
            UploadAttributes
        ]
    }

];

export default fieldTypes