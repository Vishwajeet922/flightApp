This is the backend GET API for looking up all the bookings a user has made http://localhost:8080/api/v1/booking/myBookings

In the above api JWT token also needs to be passed in the Authorization beare.

Below is a sample response from the API
[
    {
        "id": "9d5dc897-3dbc-42e7-b568-8c5ded412349",
        "flightCode": "929442e9-465a-4f61-8327-3b06dd115dc4",
        "price": 800.00,
        "bookingClass": "ECONOMY",
        "status": "A",
        "bookedBy": "adwaitg02",
        "bookedOn": "2024-11-13T10:01:40.666378",
        "modifiedOn": null
    }
]