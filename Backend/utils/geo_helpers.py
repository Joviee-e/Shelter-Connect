from math import radians, cos, sin, asin, sqrt


def haversine_distance(lat1, lng1, lat2, lng2):
    R = 6371

    lat1, lng1, lat2, lng2 = map(
        radians, [lat1, lng1, lat2, lng2]
    )

    dlat = lat2 - lat1
    dlng = lng2 - lng1

    a = sin(dlat / 2) ** 2 + cos(lat1) * cos(lat2) * sin(dlng / 2) ** 2
    c = 2 * asin(sqrt(a))

    return round(R * c, 2)


def meters_to_km(meters: float):
    return round(meters / 1000, 2)
