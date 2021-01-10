<template>
  <div id="app">
    <main>
      <b-container fluid>
        <!-- User Interface controls -->
        <b-row>
          <!--<b-col lg="6" class="my-1">
            <b-form-group
              label="Sort"
              label-for="sort-by-select"
              label-cols-sm="3"
              label-align-sm="right"
              label-size="sm"
              class="mb-0"
              v-slot="{ ariaDescribedby }"
            >
              <b-input-group size="sm">
                <b-form-select
                  id="sort-by-select"
                  v-model="sortBy"
                  :options="sortOptions"
                  :aria-describedby="ariaDescribedby"
                  class="w-75"
                >
                  <template #first>
                    <option value="">-- none --</option>
                  </template>
                </b-form-select>

                <b-form-select
                  v-model="sortDesc"
                  :disabled="!sortBy"
                  :aria-describedby="ariaDescribedby"
                  size="sm"
                  class="w-25"
                >
                  <option :value="false">Asc</option>
                  <option :value="true">Desc</option>
                </b-form-select>
              </b-input-group>
            </b-form-group>
          </b-col>-->

          <!--<b-col lg="6" class="my-1">
            <b-form-group
              label="Initial sort"
              label-for="initial-sort-select"
              label-cols-sm="3"
              label-align-sm="right"
              label-size="sm"
              class="mb-0"
            >
              <b-form-select
                id="initial-sort-select"
                v-model="sortDirection"
                :options="['asc', 'desc', 'last']"
                size="sm"
              ></b-form-select>
            </b-form-group>
          </b-col>-->

          <b-col lg="6" class="my-1">
            <b-form-group
              label="Filter"
              label-for="filter-input"
              label-cols-sm="3"
              label-align-sm="right"
              label-size="sm"
              class="mb-0"
            >
              <b-input-group size="sm">
                <b-form-input
                  id="filter-input"
                  v-model="filter"
                  type="search"
                  placeholder="Type to Search"
                ></b-form-input>

                <b-input-group-append>
                  <b-button :disabled="!filter" @click="filter = ''">Clear</b-button>
                </b-input-group-append>
              </b-input-group>
            </b-form-group>
          </b-col>

          <!--<b-col lg="6" class="my-1">
            <b-form-group
              v-model="sortDirection"
              label="Filter On"
              description="Leave all unchecked to filter on all data"
              label-cols-sm="3"
              label-align-sm="right"
              label-size="sm"
              class="mb-0"
              v-slot="{ ariaDescribedby }"
            >
              <b-form-checkbox-group
                v-model="filterOn"
                :aria-describedby="ariaDescribedby"
                class="mt-1"
              >
                <b-form-checkbox value="name">Name</b-form-checkbox>
                <b-form-checkbox value="age">Age</b-form-checkbox>
                <b-form-checkbox value="isActive">Active</b-form-checkbox>
              </b-form-checkbox-group>
            </b-form-group>
          </b-col>-->

          <!--<b-col sm="5" md="6" class="my-1">
            <b-form-group
              label="Per page"
              label-for="per-page-select"
              label-cols-sm="6"
              label-cols-md="4"
              label-cols-lg="3"
              label-align-sm="right"
              label-size="sm"
              class="mb-0"
            >
              <b-form-select
                id="per-page-select"
                v-model="perPage"
                :options="pageOptions"
                size="sm"
              ></b-form-select>
            </b-form-group>
          </b-col>

          <b-col sm="7" md="6" class="my-1">
            <b-pagination
              v-model="currentPage"
              :total-rows="totalRows"
              :per-page="perPage"
              align="fill"
              size="sm"
              class="my-0"
            ></b-pagination>
          </b-col>-->
        </b-row>

        <!-- Main table element -->
        <b-table
          :items="items"
          :fields="fields"
          :filter="filter"
          :filter-included-fields="filterOn"
          :sort-by.sync="sortBy"
          :sort-desc.sync="sortDesc"
          :sort-direction="sortDirection"
          stacked="md"
          show-empty
          small
          @filtered="onFiltered"

          sticky-header
          head-variant="light"
          sort-icon-left
          outlined
        >
          <!--<template #table-busy>
            <div class="text-center text-danger my-2">
              <b-spinner class="align-middle"></b-spinner>
              <strong>Loading...</strong>
            </div>
          </template>-->
        </b-table>
        <div
          v-infinite-scroll="loadMore"
          infinite-scroll-disabled="busy"
          infinite-scroll-distance="10"></div>
      </b-container>
    </main>
  </div>
</template>

<script>
const OpenAQ = require('openaq')
const client = new OpenAQ()

export default {
  name: 'App',
  data () {
    return {
      busy: false,

      items: [],
      fields: [
        { key: 'location', label: 'Location', sortable: true, sortDirection: 'desc' },
        { key: 'city', label: 'City', sortable: true, class: 'text-center' },
        { key: 'country', label: 'Country', sortable: true, class: 'text-center' },
        {
          key: 'measurement',
          label: 'Measurement',
          formatter: (value, key, item) => {
            return this.measurementFormatter(value)
          },
          sortable: true,
          sortByFormatted: true,
          filterByFormatted: true
        },
        {
          key: 'coordinates',
          label: 'Coordinates',
          formatter: (value, key, item) => {
            return this.coordinatesFormatter(value)
          },
          sortable: true
        },
        {
          key: 'lastUpdated',
          label: 'Date',
          formatter: (value, key, item) => {
            return this.dateBuilder(value)
          },
          sortable: true,
          sortByFormatted: false,
          filterByFormatted: true
        }
      ],
      totalRows: 1,
      currentPage: 1,
      perPage: 5,
      pageOptions: [5, 10, 15, { value: 100, text: 'Show a lot' }],
      sortBy: '',
      sortDesc: false,
      sortDirection: 'asc',
      filter: null,
      filterOn: ['city', 'country']
    }
  },
  computed: {
    sortOptions () {
      return this.fields
        .filter(f => f.sortable)
        .map(f => {
          return { text: f.label, value: f.key }
        })
    }
  },
  watch: {
    $route: function () {
      this.reload()
    }
  },
  mounted () {
    this.totalRows = this.items.length
    this.reload()
  },
  methods: {
    onFiltered (filteredItems) {
      this.totalRows = filteredItems.length
      this.currentPage = 1
    },
    reload () {
      if (!this.busy) {
        this.busy = true

        client.latest({
          limit: this.perPage,
          page: this.currentPage
        }).then(data => {
          for (const set of data.results) {
            let element = {}
            element = { city: set.city, coordinates: set.coordinates, country: set.country, location: set.location }
            element.measurement = {
              unit: set.measurements[0].unit,
              parameter: set.measurements[0].parameter,
              value: set.measurements[0].value
            }
            element.lastUpdated = set.measurements[0].lastUpdated
            this.items.push(element)
          }
          this.busy = false
        })
      }
    },
    loadMore () {
      this.currentPage += 1
      this.reload()
    },
    dateBuilder (temp) {
      const d = new Date(temp)
      const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

      const day = days[d.getDay()]
      const date = d.getDate()
      const month = months[d.getMonth()]
      const year = d.getFullYear()

      const hour = ('00' + d.getHours()).slice(-2)
      const minute = ('00' + d.getMinutes()).slice(-2)

      return `${day}, ${date} ${month}, ${year} ${hour}:${minute}`
    },
    measurementFormatter (value) {
      if (value !== null) {
        return value.parameter + ': ' + value.value + value.unit
      } else {
        return '\xa0'
      }
    },
    coordinatesFormatter (coordinates) {
      if (coordinates !== null) {
        return coordinates.longitude + ' | ' + coordinates.latitude
      } else {
        return '\xa0'
      }
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
    position: fixed;
    width: 100%;
    height: 100px;
    z-index: 1;
  }

  .sorter {
    flex-flow: row !important;
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
    min-width: 500px !important;
    padding: 10px 25px;
    margin: 0 20px 50px 20px;
    background-color: rgba(255, 255, 255, 0.25);
    border-radius: 16px;
  }

  .location {
    font-size: 38px;
    font-weight: 600;
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
    margin-top: 16px !important;
  }

  .pollution-box {
    padding: 10px 25px;
    font-size: 48px;
    font-weight: 700;
    text-align: center;

    text-shadow: 3px 6px rgba(0, 0, 0, 0.25);
    background-color: rgba(0, 0, 0, 0.15);
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
