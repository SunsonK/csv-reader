# CSV-reader

This project will enable csv parsing into json data, and querying the json data. Data will be stored via MongoDB

Pre-requisites:
- MongoDB installed locally
- Node v14++


To run project:
- npm i
- npm run start

Two APIs are served:
- sales/record
- sales/report

Sample Curl request:
- curl --location --request POST 'hostname:port_number/sales/record' -F 'file=@test.csv'
- For date range: curl -X GET 'hostname:port_number/sales/report?to=2022&from=2020'
- For single date query: curl -X GET 'hostname:port_number/sales/report?date=2020-11-05'