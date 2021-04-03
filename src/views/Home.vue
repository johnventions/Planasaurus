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
              Online collaboration for whatever your team needs.
            </h3>
            <p>
              Planasaurus gives you and your team one place to share your projects, notes, contacts... anything goes. We don't care if you're tracking business leads or Christmas trees, anything is possible.
            </p>
            <p>
              Build the interface of your dreams instead of wasting time in spreadsheets or sending documents back and forth. Search, update, and get stuff done all in one place.
            </p>
          </v-col>
        </v-row>
      </v-container>
    </v-sheet>
    <v-sheet color="primary" dark class="py-6">
      <v-container>
        <v-row class="">
          <v-col class="text-left col-12 col-md-8">
            <h2 class="text-decoration-underline mb-2">
              Easy to Use. Easy to Edit.
            </h2>
            <p>
              <ol>
                <li>Define the properties you want</li>
                <li>Add some entries</li>
                <li>Walk away</li>
              </ol>
              <br/>
              Need to add more fields later? Not a problem.
            </p>
          </v-col>
          <v-col class="col-12 col-md-8 offset-md-4 text-right">
            <h2 class="text-decoration-underline mb-2">
              Searchable and Sortable
            </h2>
            <p>
              Hit "Find" and type what you're looking for. 
              <br/>
              Search by text, date range, checkbox or any combination of properties.
            </p>
          </v-col>
          <v-col class="col-12 col-md-8 text-left">
            <h2 class="text-decoration-underline mb-2">
              Customizable
            </h2>
            <p>
              Build your interface with drag and drop tools.
              <br/>
              Upload files for reference later or link data to other records to keep your data nice and clean. 
            </p>
          </v-col>
          <v-col cols="12 text-center">
            <v-btn to="/features">
              - See all features -
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-sheet>
    <div class="py-6">
      <v-container class="text-center">
        <v-row>
          <v-col class="col-12 col-md-8 offset-md-2">
            <h2 class="mb-2">Get Started Today
            </h2>
            <p>
              Personal plans are free to try and get started - just sign up with your email.
            </p>
            <p>
                Upgrade at any point in the future if you need more space or want to start collaborating.
            </p>
            <v-btn color="primary" class="mr-4">
              See Plans
            </v-btn>
            <v-btn color="black" dark>
              Sign Up
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