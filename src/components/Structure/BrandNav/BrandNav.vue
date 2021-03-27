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
                        <template v-for="item in links" >
                            <v-btn text 
                                v-if="!item.mobileOnly"
                                :to="item.to" :key="item.name">
                                {{ item.name }}
                            </v-btn>
                        </template>
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
            color="primary"
            dark
            >
            <v-list
                nav
                dense>
                <v-list-item-group
                    v-model="group"
                    active-class="deep-purple--text text--accent-4">
                    <v-list-item v-for="item in links" 
                            :key="item.name"
                            :to="item.to"
                            >
                        <v-list-item-icon>
                        <v-icon>{{ item.icon }}</v-icon>
                        </v-list-item-icon>
                        <v-list-item-title>{{ item.name}}</v-list-item-title>
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
            group: null,
            links: [
                {
                name: 'Home',
                to: '/',
                icon: 'mdi-home',
                mobileOnly: true
                },
                {
                name: 'Plans',
                to: '/plans',
                icon: 'mdi-clipboard-list'
                },
                {
                name: 'Features',
                to: '/features',
                icon: 'mdi-sparkles',
                },
                {
                name: 'Sign Up / Login',
                to: '/login',
                icon: 'mdi-account',
                mobileOnly: true
                },
            ]
        }
    }
}
</script>