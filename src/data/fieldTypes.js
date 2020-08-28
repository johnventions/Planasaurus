import TextInput from "@/components/FormLayout/FieldTypes/TextInput.vue";
import DateInput from "@/components/FormLayout/FieldTypes/DateInput.vue";
import DropdownInput from "@/components/FormLayout/FieldTypes/DropdownInput.vue";
import RadioInput from "@/components/FormLayout/FieldTypes/RadioInput.vue";

const fieldTypes = [
    {
        id: 1,
        name: "Text Input",
        layoutComponent: TextInput,
    },
    {
        id: 2,
        name: "Number",
        layoutComponent: TextInput,
    },
    {
        id: 3,
        name: "Date",
        layoutComponent: DateInput,
    },
    {
        id: 4,
        name: "Radio Input (Yes / No)",
        layoutComponent: RadioInput,
    },
    {
        id: 5,
        name: "Dropdown (Static)",
        layoutComponent: DropdownInput,
    },
    {
        id: 6,
        name: "Dropdown (Related Item)",
        layoutComponent: DropdownInput,
    }
];

export default fieldTypes