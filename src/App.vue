<template>
  <div id="app">
    <main>
      <b-container>
        <b-row class="header">
          <b-col class="search-box">
            <input
              type="text"
              class="search-bar"
              placeholder="Search..."
              v-model="query"
            />
          </b-col>
          <b-col>
            <font-awesome-icon :icon="['fa', 'sort-up']" />
          </b-col>
        </b-row>

        <b-row class="measurement-wrap">
          <b-col>
            <b-card-group
              class="group"
              deck>
              <b-card
                class="pollution-wrap"
                no-body
                v-for="location in data"
                :key="location.location"
              >

                <b-card-header class="location">
                  {{ location.location }}
                </b-card-header>
                <b-card-sub-title class="city">
                    <font-awesome-icon :icon="['fas', 'map']" />
                    {{ location.city }}, {{ location.country }}
                </b-card-sub-title>
                <b-card-body class="pollution-box" v-if="location.measurements">
                  <font-awesome-icon :icon="['fas', 'wind']" />
                  {{ location.measurements[0].parameter }}:
                  {{ location.measurements[0].value }}
                  {{ location.measurements[0].unit }}
                </b-card-body>
                <b-card-footer>
                  <div class="coordinate-box" v-if="location.coordinates">
                    <font-awesome-icon :icon="['fas', 'globe']" />
                    {{ location.coordinates.longitude }}
                    |
                    {{ location.coordinates.latitude }}
                  </div>
                  <div class="date-box" v-if="location.measurements[0].lastUpdated">
                    <font-awesome-icon :icon="['fas', 'calendar-alt']" />
                    {{ dateBuilder(location.measurements[0].lastUpdated) }}
                  </div>
                </b-card-footer>
              </b-card>
            </b-card-group>
          </b-col>
        </b-row>
        <div v-infinite-scroll="reload" infinite-scroll-disabled="busy" infinite-scroll-immediate-check>
          <!-- https://www.npmjs.com/package/vue-infinite-scroll -->
        </div>
      </b-container>
    </main>
  </div>
</template>

<script>
// import { getter } from '@/backend/axiosHelper.js'
// import axios from 'axios'
// const OpenAQ = require('openaq')
// const client = new OpenAQ()
// const client = new openaq

export default {
  name: 'App',
  data () {
    return {
      url_base: 'https://api.openaq.org/v1/latest/',
      query: '',
      data: {},
      page: 1,
      limit: 100,
      busy: false
    }
  },
  watch: {
    $route: function () {
      this.reload()
    }
  },
  mounted () {
    this.reload()
  },
  methods: {
    reload () {
      this.busy = true

      this.data = {
        Belgium123: {
          location: 'Belgium123',
          measurements: [{ unit: 'pma', value: 2.0, parameter: 'CO', lastUpdated: '2021-01-09T10:27:01.501Z' }],
          coordinates: { latitude: 3, longitude: 4 },
          city: 'Brussel',
          country: 'Belgium'
        },
        FH: {
          location: 'FH',
          measurements: [{ unit: 'pma', value: 2.0, parameter: 'CO', lastUpdated: '2020-11-12T10:27:01.501Z' }],
          coordinates: { latitude: 3, longitude: 4 },
          city: 'Vienna',
          country: 'Austria'
        },
        'Oxford Campus': {
          location: 'Oxford Campus',
          measurements: [{ unit: 'ppma', value: 6.0, parameter: 'O2', lastUpdated: '2020-11-30T07:03:01.501Z' }],
          coordinates: { latitude: -43, longitude: 56 },
          city: 'Oxford',
          country: 'GB'
        }
      }

      // https://medium.com/dev-genius/why-is-my-fetch-request-to-oauth-server-being-blocked-by-cors-c8bdadb92b30
      // Cross origin wird durch Browser verboten, deshalb Backend

      /*
      client.latest().then(results => {
        this.data = results
      })
      */

      this.busy = false
    },
    /*
    async get_data () {

      const url = `${this.url_base}?limit=${this.limit}&page=${this.page}`
      console.log(url)
      const res = await axios.get(url)
      this.data = res.data
    },
    /*
    @keypress="fetchPollution"

    fetchPollution (e) {
      if (e.key === 'Enter') {
        this.data = {}
        fetch(`${this.url_base}?city=${this.query}`)
          .then(res => {
            return res.json()
          })
          .then(this.appendResults)
      }
    },
    getQuery () {
      return ''
    },
    appendResults (results) {
      console.log(results)
      console.log(results.results)
      if (this.data.length === undefined) {
        this.data = results.results
      } else {
        for (const i in results.results) {
          this.data.push(results.results[i])
        }
      }
    },
     */
    dateBuilder (temp) {
      const d = new Date(temp)
      const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

      const day = days[d.getDay()]
      const date = d.getDate()
      const month = months[d.getMonth()]
      const year = d.getFullYear()

      const hour = d.getHours()
      const minute = d.getMinutes()

      return `${day}, ${date} ${month}, ${year} ${hour}:${minute}`
    }
  }
}
</script>

<style>
  * {
    box-sizing: border-box;
  }

  body {
    font-family: 'montserrat', sans-serif;
    background-color: blue;
  }

  main {
    padding: 25px;
  }

  @media (min-width: 600px) {
    .group {
      column-count: 2;
    }
  }

  svg {
    font-size: 32px;
  }

  .header {
    top: 0;
    left: 0;
    background-color: blue;
    position: fixed;
    width: 100%;
    height: 100px;
    z-index: 1;
  }

  .search-box {
    width: calc(100% - 66px);
    padding: 0;
    margin: 20px 33px;
  }

  .search-box .search-bar {
    width: 100%;
    padding: 15px;

    color: #313131;
    font-size: 20px;

    appearance: none;
    border: none;
    outline: none;

    box-shadow: 0 0 8px rgba(0, 0, 0, 0.25);
    background-color: rgba(255, 255, 255, 0.5);
    border-radius: 0 16px 0 16px;
    transition: 0.4s;
  }

  .search-box .search-bar:focus {
    box-shadow: 0 0 16px rgba(0, 0, 0, 0.25);
    background-color: rgba(255, 255, 255, 0.75);
    border-radius: 16px 0 16px 0;
  }

  .measurement-wrap {
    position: relative;
    padding-top: 100px;
  }

  .pollution-wrap {
    display: inline-block;
    width: calc(100% - 40px);
    flex-grow: 1;
    flex-shrink: 1;
    padding: 10px 25px;
    margin: 0 20px 50px 20px;
    color: #FFF;
    background-color: rgba(255, 255, 255, 0.25);
    border-radius: 16px;
  }

  .location {
    font-size: 48px;
    font-weight: 700;
    text-shadow: 3px 6px rgba(0, 0, 0, 0.25);
    text-align: center;
    margin: 30px 0;
  }

  .city {
    font-size: 32px;
    font-weight: 500;
    font-style: italic;
    text-align: center;
    margin: 30px 0;
  }

  .pollution-box {
    padding: 10px 25px;
    font-size: 64px;
    font-weight: 900;
    text-align: center;

    text-shadow: 3px 6px rgba(0, 0, 0, 0.25);
    background-color: rgba(255, 255, 255, 0.25);
    border-radius: 16px;
    margin: 30px 0;

    box-shadow: 3px 6px rgba(0, 0, 0, 0.25);
  }

  .coordinate-box {
    font-size: 20px;
    font-weight: 400;
  }

  .date-box {
    font-size: 28px;
    font-weight: 500;
    text-shadow: 1px 3px rgba(0, 0, 0, 0.25);
  }

</style>
