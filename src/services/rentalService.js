import http from "./httpService";

const rentalUrl = `/rentals`;

function rentalIdUrl(rentalId) {
  return `${rentalUrl}/${rentalId}`;
}

export function getRentals() {
  return http.get(rentalUrl);
}
export function deleteRental(e) {
  const id = e.target.value;
  return http.delete(rentalIdUrl(id));
}

export function getRental(id) {
  try {
    return http.get(rentalIdUrl(id));
  } catch (ex) {
    return "not found";
  }
}

export function addRental(data) {
  try {
    return http.post(rentalUrl, { ...data });
  } catch (ex) {
    return "not found";
  }
}
