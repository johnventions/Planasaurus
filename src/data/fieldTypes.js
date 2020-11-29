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


const fieldTypes = [
    {
        id: 1,
        name: "Text Input",
        type: "text",
        layoutComponent: TextInput,
        editingComponent: BasicInputEditable,
    },
    {
        id: 2,
        name: "Number",
        layoutComponent: TextInput,
        editingComponent: BasicInputEditable,
    },
    {
        id: 3,
        name: "Date",
        type: "datetime-local",
        layoutComponent: DateInput,
        editingComponent: BasicInputEditable,
    },
    {
        id: 4,
        name: "Radio Input (Yes / No)",
        layoutComponent: RadioInput,
        editingComponent: RadioInputEditable,
    },
    {
        id: 5,
        name: "Dropdown (Static)",
        layoutComponent: DropdownInput,
        editingComponent: DropdownInputEditable,
    },
    {
        id: 6,
        name: "Dropdown (Related Item)",
        layoutComponent: DropdownInput,
        editingComponent: DropdownInputEditable,
    }
];

export default fieldTypes