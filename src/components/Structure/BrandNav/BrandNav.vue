<template>
    <div>
        <v-app-bar app color="black" dark class="">
            <v-container class="py-0 fill-height">
                <v-row>
                    <v-toolbar-title class="py-2">
                        <v-icon>
                            mdi-egg-easter
                        </v-icon>
                        Planasaurus
                    </v-toolbar-title>
                    <v-spacer></v-spacer>
                    <div class="py-2 d-none d-md-block">
                        <v-btn text to="/plans">Plans</v-btn>
                        <v-btn text to="/features">Features</v-btn>
                        <v-btn class="ml-6" color="primary" to="/login">Login</v-btn>
                    </div>
                    <v-app-bar-nav-icon 
                        class="d-md-none"
                        @click="drawer = true">
                    </v-app-bar-nav-icon>
                </v-row>
            </v-container>
        </v-app-bar>
        <v-navigation-drawer
            v-model="drawer"
            absolute
            temporary
            >
            <v-list
                nav
                dense>
                <v-list-item-group
                    v-model="group"
                    active-class="deep-purple--text text--accent-4">
                    <v-list-item>
                        <v-list-item-icon>
                        <v-icon>mdi-home</v-icon>
                        </v-list-item-icon>
                        <v-list-item-title>Home</v-list-item-title>
                    </v-list-item>
                    <v-list-item>
                        <v-list-item-icon>
                        <v-icon>mdi-clipboard-list</v-icon>
                        </v-list-item-icon>
                        <v-list-item-title>Plans</v-list-item-title>
                    </v-list-item>
                    <v-list-item>
                        <v-list-item-icon>
                        <v-icon>mdi-sparkles</v-icon>
                        </v-list-item-icon>
                        <v-list-item-title>Features</v-list-item-title>
                    </v-list-item>
                    <v-list-item>
                        <v-list-item-icon>
                        <v-icon>mdi-account</v-icon>
                        </v-list-item-icon>
                        <v-list-item-title>Sign Up / Login</v-list-item-title>
                    </v-list-item>
                </v-list-item-group>
            </v-list>
        </v-navigation-drawer>
    </div>
</template>
<script>
export default {
    name: 'BrandNav',
    data: function() {
        return {
            drawer: false,
            group: null
        }
    }
}
</script>