# code-now

This is my approach to the Accenture *<code.now />* challenge.

I used **Vue** for the frontend and [openaq](https://github.com/nickolasclarke/openaq) in the backend.

## Done

#### In the Frontend:

- Responsive UI, ensuring adaptive viewport for mobile devices and PC/laptop
- Clean and modern design
- The following attributes need to be displayed in the order given:
    - the location name
    - the city and country name
    - the air pollution value and its measurement unit and particulate matter parameter
    - the location's longitude and latitude value
    - the local date and time value
- The list must support infinite scrolling and should be sortable by each attribute(ASC and DESC)

- Additionally, the client demands a solution capable of filtering the data by;
    - one country
    - one city

---

#### In the Backend:

- Fetch data from AQ public API

## ToDo

In the Frontend:

- Test coverage

- Code documentation

---

In the Backend:

- Insert AQ API data into a database
- Provide endpoint to serve AQ data to the frontend


### Project setup
```
npm install
```

#### Compiles and hot-reloads for development
```
npm run serve
```

#### Compiles and minifies for production
```
npm run build
```
