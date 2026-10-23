curl --location 'http://localhost:3001/course/getAllCourseWithPagination?search=&limit=10&page=1&sortType=null&order=asc&minPrice=null&maxPrice=null' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwZXJzb25JZCI6ImI1YTc4OWQxLWJhZDUtNDhhMC04ODY4LWVmNjlhNGVmYzg1OCIsInJvbGUiOiJUZWFjaGVyIiwiaWF0IjoxNzkyMjUzNzMzLCJleHAiOjE3OTIyNTQ2MzN9.i-Bp8KqNrM02kTYJIzgGXvjhWhU_C2P3necZ42R_8gg'

curl --location 'http://localhost:3001/course/54fce1de-c408-47bb-95fd-443136a67d0a' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwZXJzb25JZCI6ImI1YTc4OWQxLWJhZDUtNDhhMC04ODY4LWVmNjlhNGVmYzg1OCIsInJvbGUiOiJUZWFjaGVyIiwiaWF0IjoxNzkyMjUzNzMzLCJleHAiOjE3OTIyNTQ2MzN9.i-Bp8KqNrM02kTYJIzgGXvjhWhU_C2P3necZ42R_8gg'

curl --location 'http://localhost:3001/course/54fce1de-c408-47bb-95fd-443136a67d0a/topics' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwZXJzb25JZCI6ImI1YTc4OWQxLWJhZDUtNDhhMC04ODY4LWVmNjlhNGVmYzg1OCIsInJvbGUiOiJUZWFjaGVyIiwiaWF0IjoxNzkyMjUzNzMzLCJleHAiOjE3OTIyNTQ2MzN9.i-Bp8KqNrM02kTYJIzgGXvjhWhU_C2P3necZ42R_8gg'

curl --location 'http://localhost:3001/user/register' \
--header 'Content-Type: application/json' \
--data-raw '{
    "phoneNumber":"09117344851",
    "email":"mosayebimersad83@gmail.com",
    "password":"123456782"
}'

curl --location 'http://localhost:3001/user/login' \
--header 'x-device-id: my-test-device-001' \
--header 'Content-Type: application/json' \
--data-raw '{
    "email":"mosaybimersvd020@gmail.com",
    "password":"123456782"
}'

curl --location 'http://localhost:3001/user/step1_forgetPassword' \
--header 'Content-Type: application/json' \
--data-raw '{
    "email":"mosaybimersvd020@gmail.com"
}'

curl --location 'http://localhost:3001/user/step2_resetPassword' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwZXJzb25JZCI6ImI1YTc4OWQxLWJhZDUtNDhhMC04ODY4LWVmNjlhNGVmYzg1OCIsInJvbGUiOiJUZWFjaGVyIiwiaWF0IjoxNzkyMjUzNzMzLCJleHAiOjE3OTIyNTQ2MzN9.i-Bp8KqNrM02kTYJIzgGXvjhWhU_C2P3necZ42R_8gg' \
--data-raw '{
    "email":"mosaybimersvd020@gmail.com",
    "otpCode":"305900",
    "password":"123456782"
}'

curl --location 'http://localhost:3001/user/refreshToken' \
--header 'x-device-id: my-test-device-001' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwZXJzb25JZCI6ImI1YTc4OWQxLWJhZDUtNDhhMC04ODY4LWVmNjlhNGVmYzg1OCIsInJvbGUiOiJUZWFjaGVyIiwiaWF0IjoxNzkyMjUzNzMzLCJleHAiOjE3OTIyNTQ2MzN9.i-Bp8KqNrM02kTYJIzgGXvjhWhU_C2P3necZ42R_8gg' \
--data '{
    
    "refreshToken":"cf391020d2416c1d73ef4c7c7463886fd964177ff80864b70937bc270e917fab0acb5a1a7f5054e7"
}'

curl --location 'http://localhost:3001/user/userBoard'


curl --location 'http://localhost:3001/user/profile/b5a789d1-bad5-48a0-8868-ef69a4efc858' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwZXJzb25JZCI6ImI1YTc4OWQxLWJhZDUtNDhhMC04ODY4LWVmNjlhNGVmYzg1OCIsInJvbGUiOiJUZWFjaGVyIiwiaWF0IjoxNzkyMjUzNzMzLCJleHAiOjE3OTIyNTQ2MzN9.i-Bp8KqNrM02kTYJIzgGXvjhWhU_C2P3necZ42R_8gg' \
--data ''


curl --location --request GET 'http://localhost:3001/course/getAllcategories' \
--header 'Content-Type: text/plain' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwZXJzb25JZCI6ImI1YTc4OWQxLWJhZDUtNDhhMC04ODY4LWVmNjlhNGVmYzg1OCIsInJvbGUiOiJUZWFjaGVyIiwiaWF0IjoxNzkyMjUzNzMzLCJleHAiOjE3OTIyNTQ2MzN9.i-Bp8KqNrM02kTYJIzgGXvjhWhU_C2P3necZ42R_8gg' \
--data '{
    "name":"express.js"
}'

curl --location 'http://localhost:3001/wallet/payment/gateway' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwZXJzb25JZCI6IjQ5YTQyYjU4LTkxZDItNDQ1OC04YzBjLWQzY2IxZTUwZmM4MCIsInJvbGUiOiJVc2VyIiwiaWF0IjoxNzkyNzg1MTI4LCJleHAiOjE3OTI3ODYwMjh9.OYmoyN1NnjcGC7SgeI_6FkYqwb8jpnWPTH5xEhv1UVs' \
--data '{
   "itemId":"031e27cc-e6fa-47ef-8f94-12dbe3cdccce",
   "itemType":"Course"
}'

