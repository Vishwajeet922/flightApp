This is the api for getting a particular flight
localhost:8080/api/v1/flight/{flightid}
Example
localhost:8080/api/v1/flight/b195bb05-32ac-433c-ae80-1e486affbaf1

Create a page dedicated the the flight use carousels, use any library if required for image carousels.
Display all the flight details

Below is the response the API returns
{
    "id": "b195bb05-32ac-433c-ae80-1e486affbaf1",
    "airline": "Aer Lingus",
    "fromAirport": "Chennai",
    "toAirport": "Dublin",
    "flyDate": "2024-11-07",
    "duration": "8 Hours",
    "price": 600.00,
    "features": [
        "Premium",
        "Free Cancellation",
        "Meals Included"
    ],
    "images": [
        "https://media.istockphoto.com/id/155439315/photo/passenger-airplane-flying-above-clouds-during-sunset.jpg?s=612x612&w=0&k=20&c=LJWadbs3B-jSGJBVy9s0f8gZMHi2NvWFXa3VJ2lFcL0=",
        "https://img.freepik.com/free-photo/airplane_74190-463.jpg",
        "https://thumbor.forbes.com/thumbor/fit-in/900x510/https://www.forbes.com/advisor/wp-content/uploads/2021/10/Getty-1-1.jpg"
    ],
    "status": "AVAILABLE"
}