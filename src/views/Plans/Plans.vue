<template>
    <v-container>
        <h1>Plans</h1>
        <p>
            We hope to provide you with an easy and carefree experience at whatever level you and your team need.
        </p>
        <p>
                Our standard plans are listed below but please feel free to reach out to our sales team if you need any custom features or functionality beyond our standard offering.
        </p>
        <div class="plans mt-8">
            <v-card class="mb-6">
                <v-row>
                    <div class="col-12 col-md-3 col-lg-2">
                        <v-card-title class="py-2">
                            Free Plan
                        </v-card-title>
                        <v-card-text>
                            <span class="plan-price">$0 / month</span>
                        </v-card-text>
                    </div>
                    <div class="col">
                        <v-card-text>
                            For everyone just getting started or those with minimal needs. All new accounts default to the free plan but you're welcome to upgrade if you want to share your workspace with others or add a large amount of data.
                            <ul>
                            <li>One user, one workspace</li> 
                            <li>Up to 5 data types and 250 records</li>
                            <li>Up to 1GB file storage</li>
                            </ul>
                        </v-card-text>
                    </div>
                </v-row>
            </v-card>
            <v-card class="mb-6">
                <v-row>
                    <div class="col-12 col-md-3 col-lg-2">
                        <v-card-title class="py-2">
                             Basic Plan
                        </v-card-title>
                        <v-card-text>
                            <span class="plan-price">$6 / month PER user</span>
                        </v-card-text>
                    </div>
                    <div class="col">
                        <v-card-text>
                            Perfect for small teams. Share your work with others so that everyone is always up to speed on what is going on.
                            <ul>
                            <li>Charged per user up to 8 users</li> 
                            <li>Up to 10 data types and 2,000 records</li>
                            <li>Up to 5GB file storage</li>
                            </ul>
                        </v-card-text>
                    </div>
                </v-row>
            </v-card>
            <v-card class="mb-6">
                <v-row>
                    <div class="col-12 col-md-3 col-lg-2">
                        <v-card-title class="py-2">
                            Pro Plan
                        </v-card-title>
                        <v-card-text>
                            <span class="plan-price">$8 / month PER user</span>
                        </v-card-text>
                    </div>
                    <div class="col">
                        <v-card-text>
                            The tool to keep your business running on a day to day basis. 
                            <ul>
                            <li>Custom domain and logo</li> 
                            <li>Charged per users, 8 to 50 users</li> 
                            <li>Up to 25 data types and 10,000 records</li>
                            <li>Up to 25GB file storage</li>
                            </ul>
                        </v-card-text>
                    </div>
                </v-row>
            </v-card>
            <v-card class="mb-6">
                <v-row>
                    <div class="col-12 col-md-3 col-lg-2 text-center">
                        <v-icon large class="mt-4">
                            mdi-phone-in-talk
                        </v-icon>
                    </div>
                    <div class="col">
                        <v-card-title class="py-2">
                            Need more?
                        </v-card-title>
                        <v-card-text>
                            Contact us for larger plan pricing and access to even more custom features.
                        </v-card-text>
                    </div>
                </v-row>
                
            </v-card>
        </div>
    </v-container>
</template>
<script>
export default {

}
</script>
<style lang="scss" scoped>
    .plans {
        .plan-price {
            display: block;
            font-weight: bold;
        }
    }
</style>