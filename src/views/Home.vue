<template>
  <div class="home">
    <v-sheet color="" dark class="hero">
      <v-container class="py-15 ">
        <v-row
          align="center"
          justify="center"
        >
          <v-col
            class="text-center"
            cols="12"
          >
            <h1 class="mb-4">
              The database that does it all.
            </h1>
            <h4 class="subheading mb-4">
              Customized web-database software for your team, hobby, or workplace.
              <br/>No coding required.
            </h4>
            <v-btn color="primary">
              Sign Up for free
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-sheet>
    <v-sheet class="py-6">
      <v-container>
        <v-row>
          <v-col class="col-md-6">
            <h3 class="mb-2">
              Online collaboration for whatever you need.
            </h3>
            <p>
              Planasaurus gives you and your team one place to share your projects, notes, contacts - you name it.. We don't care if you're tracking business leads or Christmas trees, anything is possible.
            </p>
            <p>
              Build the interface of your dreams instead of wasting time in spreadsheets or sending documents back and forth.
            </p>
          </v-col>
        </v-row>
      </v-container>
    </v-sheet>
    <v-sheet color="primary" dark class="py-6">
      <v-container>
        <v-row class="text-center">
          <v-col class="col-12 col-md-4">
            <h2 class="text-decoration-underline mb-2">
              Easy to Use
            </h2>
            <p>
              Define the data you want, add some entries, walk away. Need to add more fields later? Not a problem.
            </p>
          </v-col>
          <v-col class="col-12 col-md-4">
            <h2 class="text-decoration-underline mb-2">
              Highly Searchable
            </h2>
            <p>
              Hit "Find" and type what you're looking for. Sort data or search by text, date range, checkbox or any combination.
            </p>
          </v-col>
          <v-col class="col-12 col-md-4">
            <h2 class="text-decoration-underline mb-2">
              Customizable
            </h2>
            <p>
              Drag and drop your interface to suit your needs. Upload files, link data to other records. 
            </p>
          </v-col>
          <v-col cols="12">
            <v-btn to="/features">
              See all features
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-sheet>
    <div class="py-6">
      <v-container class="text-right">
        <v-row>
          <v-col class="col-12 col-md-6">

          </v-col>
          <v-col class="col-12 col-md-6">
            <h2 class="mb-2">Get Started Today
            </h2>
            <p>
              Personal plans are free to try and get started - just sign up with your email.
              </p><p>
                If you need more space or want to start collaborating, just upgrade to a basic or professional plan.
            </p>
            <v-btn color="primary">
              See Plans
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
//import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: 'Home'
}
</script>
<style lang="scss">
  .hero {
    background: url("/img/home/home-hero.jpg");
    background-size: cover;
    position: relative;

    .container {
      position: relative;
      z-index: 2;
    }

    &:before {
      display: block;
      content: '';
      position: absolute;
      width: 100%;
      height: 100%;
      background: rgb(0, 0, 0, 0.22);
      z-index: 1;
    }
  }
  
  h1 {
    font-size: 42px;
  }

  h2 {
    font-size: 24px;
  }
</style>