<template src="./Configure.html"></template>
<script>
import { mapState } from 'vuex';
import axios from 'axios'
import TypeCard from '@/components/Admin/TypeCard/TypeCard.vue';

export default {
    name: 'Configure',
    components: {
        'type-card': TypeCard,
    },
    data: function() {
        return {
            editingType: null,
        }
    },
    computed: {
        ...mapState({
            topLevelProjects: state => state.projectTypes.filter(x => x.parent_id == null),
            projectTypes: state => state.projectTypes
        }),
        possibleParents: function() {
            const types = this.$store.state.projectTypes;
            return [
                {
                    id: null,
                    name: 'None'
                },
                ... types
            ];
        }
    },
    methods: {
        getTypeChildren: function(id) {
            return this.projectTypes.filter(x => x.parent_id == id);
        },
        editType: function(id) {
            const t = this.projectTypes.find(x => x.id == id);
            if (t) {
                this.editingType = { ... t};
                this.$modal.show('editTypeModal');
            }
        },
        newType: function() {
            this.editingType = {
                id: 'new',
                name: '',
                codename: '',
            }
        },
        saveType: function() {
            const url = `/api/types/${ this.editingType.id }`;
            let update = this.editingType.id == 'new' ? axios.put(url) : axios.post(url);
            update.then( (response) => {
                console.log(response);
                this.$modal.hide('editTypeModal');
            })
        }
    }
}
</script>