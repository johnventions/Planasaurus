<template src="./Configure.html"></template>
<script>
import { mapState, mapActions } from 'vuex';
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
            const types = this.$store.state.projectTypes.filter(x => x.id != this.editingType.id);
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
        ...mapActions([
            'getTypes'
        ]),
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
                id: 0,
                name: '',
                codename: '',
                menu_order: 0,
                parent_id: null,
            };
            this.$modal.show('editTypeModal');
        },
        saveType: function() {
            const url = `/api/types${ this.editingType.id != 0 ? '/' + this.editingType.id  : '' }`;
            let update = this.editingType.id == 0 ? axios.post(url, this.editingType) : axios.put(url, this.editingType);
            update.then( () => {
                this.getTypes();
                this.$modal.hide('editTypeModal');
            })
        }
    }
}
</script>